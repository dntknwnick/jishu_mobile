import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { testApi } from '../services/apiEndpoints';
import { diagnoseNetwork } from '../services/networkDiagnostics';

const TestsScreen = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');
  const [testCards, setTestCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestCards();
  }, []);

  const fetchTestCards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📋 Fetching test cards...');

      const response = await testApi.getTestCards();

      if (response.success && response.data?.test_cards_by_subject) {
        console.log('✅ Test cards fetched:', response.data.test_cards_by_subject.length, 'subjects');
        setTestCards(response.data.test_cards_by_subject);
      } else {
        const errorMsg = response.message || 'Failed to fetch test cards';
        console.warn('⚠️ API returned non-success response:', response);
        throw new Error(errorMsg);
      }
    } catch (err) {
      let errorMessage = 'Failed to load tests';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = (err as any).message;
      }

      console.error('❌ Error fetching test cards:', {
        error: errorMessage,
        fullError: err,
      });

      // Run network diagnostics to help debug
      console.log('🔍 Running network diagnostics...');
      const diagnostic = await diagnoseNetwork();
      console.log('📊 Diagnostic result:', diagnostic);

      setError(errorMessage);

      // Show detailed error message
      const detailedMessage = diagnostic.success
        ? errorMessage
        : `${errorMessage}\n\n${diagnostic.message}`;

      Alert.alert('Error Loading Tests', detailedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = async (testId: number) => {
    try {
      console.log('🚀 Starting test:', testId);
      const response = await testApi.startTest(testId);

      if (response.success) {
        Alert.alert('Success', 'Test started! Generating questions...');
        // Navigate to test screen with session ID
      } else {
        Alert.alert('Error', response.message || 'Failed to start test');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start test';
      Alert.alert('Error', errorMessage);
    }
  };

  const renderAvailableTests = () => {
    if (testCards.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="document" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No tests available</Text>
          <Text style={styles.emptyStateSubtext}>Purchase a course to access tests</Text>
        </View>
      );
    }

    return (
      <View style={styles.testsContainer}>
        {testCards.map((subject) => (
          <View key={subject.subject_id}>
            <Text style={styles.subjectTitle}>{subject.subject_name}</Text>
            {subject.cards?.map((test: any) => (
              <TouchableOpacity
                key={test.id}
                style={styles.testCard}
                onPress={() => handleStartTest(test.id)}
              >
                <View style={[styles.testColorBar, { backgroundColor: '#6366f1' }]} />
                <View style={styles.testContent}>
                  <View style={styles.testHeader}>
                    <View>
                      <Text style={styles.testSubject}>{subject.subject_name}</Text>
                      <Text style={styles.testTitle}>Test #{test.test_number}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: test.status === 'available' ? '#d1fae5' : '#fee2e2' }]}>
                      <Text style={[styles.statusText, { color: test.status === 'available' ? '#059669' : '#dc2626' }]}>
                        {test.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.testMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#6b7280" />
                      <Text style={styles.metaText}>{test.attempts_used}/{test.max_attempts} attempts</Text>
                    </View>
                    {test.latest_score && (
                      <View style={styles.metaItem}>
                        <Ionicons name="star-outline" size={16} color="#f59e0b" />
                        <Text style={styles.metaText}>Best: {test.latest_score}%</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.startButton, { backgroundColor: test.status === 'available' ? '#6366f1' : '#d1d5db' }]}
                    disabled={test.status !== 'available'}
                    onPress={() => handleStartTest(test.id)}
                  >
                    <Text style={styles.startButtonText}>
                      {test.status === 'available' ? 'Start Test' : 'Unavailable'}
                    </Text>
                    <Ionicons name="play" size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderCompletedTests = () => {
    const completedTests = testCards
      .flatMap(subject =>
        subject.cards?.filter((card: any) => card.status === 'completed').map((card: any) => ({
          ...card,
          subject_name: subject.subject_name,
        })) || []
      );

    if (completedTests.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No completed tests</Text>
          <Text style={styles.emptyStateSubtext}>Start a test to see your results here</Text>
        </View>
      );
    }

    return (
      <View style={styles.testsContainer}>
        {completedTests.map((test: any) => (
          <TouchableOpacity key={test.id} style={styles.completedCard}>
            <View style={styles.completedHeader}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>{test.latest_percentage}%</Text>
              </View>
              <View style={styles.completedInfo}>
                <Text style={styles.completedSubject}>{test.subject_name}</Text>
                <Text style={styles.completedTitle}>Test #{test.test_number}</Text>
                <Text style={styles.completedDate}>{test.latest_attempt_date}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading tests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTestCards}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Available Tests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'available' ? renderAvailableTests() : renderCompletedTests()}
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    margin: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  testsContainer: {
    padding: 15,
  },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testColorBar: {
    height: 6,
  },
  testContent: {
    padding: 20,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  testSubject: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  testMeta: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  completedCard: {
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
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10b98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  completedInfo: {
    flex: 1,
  },
  completedSubject: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  completedDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  accuracyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accuracyLabel: {
    fontSize: 12,
    color: '#6b7280',
    width: 60,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  accuracyValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    width: 40,
    textAlign: 'right',
  },
});

export default TestsScreen;
