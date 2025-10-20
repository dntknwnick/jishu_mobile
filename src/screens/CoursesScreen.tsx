import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { coursesApi, Course } from '../services/apiEndpoints';

const { width } = Dimensions.get('window');

const CoursesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📚 Fetching courses...');

      const response = await coursesApi.getAll();

      if (response.success && response.data?.courses) {
        console.log('✅ Courses fetched:', response.data.courses.length);
        setCourses(response.data.courses);
      } else {
        throw new Error(response.message || 'Failed to fetch courses');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load courses';
      console.error('❌ Error fetching courses:', errorMessage);
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCourseIcon = (courseName: string) => {
    const name = courseName.toLowerCase();
    if (name.includes('jee') || name.includes('advance')) {
      return { icon: 'book-open-variant', color: '#3b82f6' };
    } else if (name.includes('neet')) {
      return { icon: 'hospital-box', color: '#ec4899' };
    } else if (name.includes('cet')) {
      return { icon: 'school', color: '#f59e0b' };
    } else if (name.includes('mains')) {
      return { icon: 'pencil', color: '#8b5cf6' };
    }
    return { icon: 'book-multiple', color: '#6366f1' };
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCourses}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Available Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const { icon, color } = getCourseIcon(course.course_name);
              return (
                <TouchableOpacity key={course.id} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <View style={[styles.courseIcon, { backgroundColor: `${color}15` }]}>
                      <MaterialCommunityIcons name={icon} size={32} color={color} />
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseName}>{course.course_name}</Text>
                      <Text style={styles.courseSubjects}>
                        {course.subjects?.length || 0} subjects
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
                  </View>

                  {/* Course Details */}
                  <View style={styles.courseDetails}>
                    {course.amount && (
                      <View style={styles.priceSection}>
                        <Text style={styles.priceLabel}>Price:</Text>
                        <Text style={styles.price}>₹{course.amount}</Text>
                        {course.offer_amount && (
                          <Text style={styles.offerPrice}>₹{course.offer_amount}</Text>
                        )}
                      </View>
                    )}
                    {course.max_tokens && (
                      <View style={styles.tokenSection}>
                        <Ionicons name="flash" size={16} color="#f59e0b" />
                        <Text style={styles.tokenText}>{course.max_tokens} tokens</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No courses found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 15,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  courseIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  courseSubjects: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressSection: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
  },
  exploreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#c7d2fe',
    borderStyle: 'dashed',
  },
  exploreIcon: {
    marginRight: 15,
  },
  exploreContent: {
    flex: 1,
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  exploreText: {
    fontSize: 14,
    color: '#6b7280',
  },
  courseDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  offerPrice: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  tokenSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tokenText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 16,
    color: '#9ca3af',
  },
});

export default CoursesScreen;
