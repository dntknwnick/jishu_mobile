import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import { profileApi } from '../services/apiEndpoints';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [academics, setAcademics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('👤 Fetching profile data...');

      const [statsResponse, academicsResponse] = await Promise.all([
        profileApi.getStats(),
        profileApi.getAcademics(),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
      if (academicsResponse.success && academicsResponse.data) {
        setAcademics(academicsResponse.data);
      }
      console.log('✅ Profile data fetched');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      console.error('❌ Error fetching profile:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const statsData = [
    { label: 'Tests Taken', value: stats?.total_tests_taken || '0', icon: 'document-text' },
    { label: 'Avg Score', value: stats?.average_score ? `${stats.average_score}%` : '0%', icon: 'trending-up' },
    { label: 'Study Hours', value: stats?.total_study_hours ? `${stats.total_study_hours}h` : '0h', icon: 'time' },
    { label: 'Accuracy', value: stats?.average_accuracy ? `${stats.average_accuracy}%` : '0%', icon: 'checkmark-circle' },
  ];

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
            Alert.alert('Success', 'Logged out successfully');
          } catch (err) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'Edit Profile',
      color: '#6366f1',
      onPress: () => Alert.alert('Coming Soon', 'Edit profile feature coming soon'),
    },
    {
      icon: 'book-outline',
      label: 'My Courses',
      color: '#10b981',
      onPress: () => Alert.alert('Coming Soon', 'My courses feature coming soon'),
    },
    {
      icon: 'bookmark-outline',
      label: 'Bookmarks',
      color: '#f59e0b',
      onPress: () => Alert.alert('Coming Soon', 'Bookmarks feature coming soon'),
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      color: '#8b5cf6',
      onPress: () => Alert.alert('Coming Soon', 'Settings feature coming soon'),
    },
    {
      icon: 'log-out-outline',
      label: 'Logout',
      color: '#ef4444',
      onPress: handleLogout,
    },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={fetchProfileData}>
            <Ionicons name="refresh" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Header */}
      <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'guest@jishu.com'}</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editProfileButton}>
          <Icon name="create-outline" size={18} color="#6366f1" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Icon name={stat.icon as any} size={24} color="#6366f1" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementsRow}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <Text style={styles.achievementText}>Top 10</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🔥</Text>
            <Text style={styles.achievementText}>12 Day Streak</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>⭐</Text>
            <Text style={styles.achievementText}>Perfect Score</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    margin: 15,
    borderRadius: 8,
    gap: 10,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#dc2626',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    marginTop: -20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: '1%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#eef2ff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 5,
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  achievementsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default ProfileScreen;
