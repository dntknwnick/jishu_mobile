import axios from 'axios';
import { API_BASE_URL } from '../config/environment';

export interface DiagnosticResult {
  success: boolean;
  message: string;
  details: {
    apiUrl: string;
    serverReachable: boolean;
    healthCheckPassed: boolean;
    responseTime?: number;
    error?: string;
  };
}

/**
 * Diagnose network connectivity and API availability
 */
export const diagnoseNetwork = async (): Promise<DiagnosticResult> => {
  console.log('🔍 Starting network diagnostics...');
  console.log('📍 API Base URL:', API_BASE_URL);

  try {
    const startTime = Date.now();

    // Test basic connectivity
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });

    const responseTime = Date.now() - startTime;

    console.log('✅ Health check passed');
    console.log('⏱️ Response time:', responseTime, 'ms');

    return {
      success: true,
      message: 'API server is reachable and healthy',
      details: {
        apiUrl: API_BASE_URL,
        serverReachable: true,
        healthCheckPassed: true,
        responseTime,
      },
    };
  } catch (error: any) {
    console.error('❌ Network diagnostic failed:', error.message);

    let errorMessage = 'Unknown error';
    let serverReachable = false;

    if (error.code === 'ECONNREFUSED') {
      errorMessage = `Connection refused. Is the server running at ${API_BASE_URL}?`;
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = `Cannot resolve hostname. Check your API_BASE_URL: ${API_BASE_URL}`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Server is not responding.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Health endpoint not found. Server may be running but endpoint missing.';
      serverReachable = true;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      details: {
        apiUrl: API_BASE_URL,
        serverReachable,
        healthCheckPassed: false,
        error: error.message,
      },
    };
  }
};

/**
 * Test API authentication
 */
export const testAuthentication = async (token: string): Promise<DiagnosticResult> => {
  console.log('🔐 Testing authentication...');

  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    console.log('✅ Authentication test passed');

    return {
      success: true,
      message: 'Authentication token is valid',
      details: {
        apiUrl: API_BASE_URL,
        serverReachable: true,
        healthCheckPassed: true,
      },
    };
  } catch (error: any) {
    console.error('❌ Authentication test failed:', error.message);

    let errorMessage = 'Authentication failed';

    if (error.response?.status === 401) {
      errorMessage = 'Token is invalid or expired';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access forbidden';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = `Cannot connect to server at ${API_BASE_URL}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      details: {
        apiUrl: API_BASE_URL,
        serverReachable: error.response ? true : false,
        healthCheckPassed: false,
        error: error.message,
      },
    };
  }
};

/**
 * Test specific endpoint
 */
export const testEndpoint = async (
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  token?: string
): Promise<DiagnosticResult> => {
  console.log(`🧪 Testing endpoint: ${method} ${endpoint}`);

  try {
    const config: any = {
      timeout: 5000,
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const response = method === 'GET' 
      ? await axios.get(url, config)
      : await axios.post(url, {}, config);

    console.log(`✅ Endpoint test passed: ${endpoint}`);

    return {
      success: true,
      message: `Endpoint ${endpoint} is working`,
      details: {
        apiUrl: API_BASE_URL,
        serverReachable: true,
        healthCheckPassed: true,
      },
    };
  } catch (error: any) {
    console.error(`❌ Endpoint test failed: ${endpoint}`, error.message);

    return {
      success: false,
      message: `Endpoint test failed: ${error.message}`,
      details: {
        apiUrl: API_BASE_URL,
        serverReachable: error.response ? true : false,
        healthCheckPassed: false,
        error: error.message,
      },
    };
  }
};

export default {
  diagnoseNetwork,
  testAuthentication,
  testEndpoint,
};

