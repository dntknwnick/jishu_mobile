import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Purchase {
  id: number;
  userId: number;
  courseId: string;
  courseName: string;
  items: any[];
  amount: number;
  date: string;
  status: string;
}

interface PurchaseState {
  purchases: Purchase[];
  currentCart: {
    items: any[];
    courseId: string | null;
    courseName: string | null;
    isBundle: boolean;
    bundleDiscount: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: PurchaseState = {
  purchases: [],
  currentCart: {
    items: [],
    courseId: null,
    courseName: null,
    isBundle: false,
    bundleDiscount: 0,
  },
  isLoading: false,
  error: null,
};

// Process purchase through backend API
export const processPurchase = createAsyncThunk(
  'purchase/processPurchase',
  async (
    purchaseData: {
      courseId: string;
      subjectId?: string;
      paymentMethod: string;
      purchaseType?: 'single_subject' | 'multiple_subjects' | 'full_bundle';
    },
    { rejectWithValue }
  ) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const requestBody = {
        course_id: parseInt(purchaseData.courseId),
        subject_id: purchaseData.subjectId ? parseInt(purchaseData.subjectId) : null,
        payment_method: purchaseData.paymentMethod,
        purchase_type: purchaseData.purchaseType || 'single_subject'
      };

      const response = await fetch(`${API_BASE_URL}/api/purchases`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Purchase failed');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Purchase failed');
      }

      return data.data.purchase || data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Payment processing failed');
    }
  }
);

export const loadPurchases = createAsyncThunk(
  'purchase/loadPurchases',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/purchases`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load purchases');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load purchases');
      }

      return data.data.purchases;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load purchases');
    }
  }
);

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCart: (state, action) => {
      state.currentCart = action.payload;
    },
    clearCart: (state) => {
      state.currentCart = {
        items: [],
        courseId: null,
        courseName: null,
        isBundle: false,
        bundleDiscount: 0,
      };
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const existingIndex = state.currentCart.items.findIndex(i => i.id === item.id);
      if (existingIndex === -1) {
        state.currentCart.items.push(item);
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.currentCart.items = state.currentCart.items.filter(i => i.id !== itemId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processPurchase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processPurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchases.push(action.payload);
        state.currentCart = {
          items: [],
          courseId: null,
          courseName: null,
          isBundle: false,
          bundleDiscount: 0,
        };
      })
      .addCase(processPurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(loadPurchases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadPurchases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchases = action.payload;
      })
      .addCase(loadPurchases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCart,
  clearCart,
  addToCart,
  removeFromCart,
} = purchaseSlice.actions;
export default purchaseSlice.reducer;

