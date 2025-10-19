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
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { communityApi } from '../services/apiEndpoints';

const CommunityScreen = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      console.log('📝 Fetching community posts...');

      const response = await communityApi.getPosts(pageNum, 10);

      if (response.success && response.data?.posts) {
        if (pageNum === 1) {
          setPosts(response.data.posts);
        } else {
          setPosts([...posts, ...response.data.posts]);
        }
        setPage(pageNum);
        setHasMore(response.data.posts.length === 10);
        console.log('✅ Posts fetched:', response.data.posts.length);
      } else {
        throw new Error(response.message || 'Failed to fetch posts');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
      console.error('❌ Error fetching posts:', errorMessage);
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      console.log('❤️ Liking post:', postId);
      const response = await communityApi.likePost(postId);

      if (response.success) {
        // Update local state
        setPosts(posts.map(post =>
          post.id === postId
            ? { ...post, is_liked: !post.is_liked, likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1 }
            : post
        ));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchPosts(page + 1);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchPosts()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPostCard = (post: any) => (
    <View style={styles.postCard}>
      {/* Author Info */}
      <View style={styles.authorSection}>
        <View style={styles.avatarContainer}>
          {post.user?.avatar ? (
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {post.user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.user?.name || 'Anonymous'}</Text>
          <Text style={styles.postTime}>{post.created_at}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <TouchableOpacity>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postExcerpt} numberOfLines={3}>
          {post.content}
        </Text>
      </TouchableOpacity>

      {/* Engagement */}
      <View style={styles.engagementSection}>
        <TouchableOpacity
          style={styles.engagementButton}
          onPress={() => handleLikePost(post.id)}
        >
          <Ionicons
            name={post.is_liked ? 'heart' : 'heart-outline'}
            size={22}
            color={post.is_liked ? '#ef4444' : '#6b7280'}
          />
          <Text style={styles.engagementText}>{post.likes_count || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.engagementButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
          <Text style={styles.engagementText}>{post.comments_count || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.engagementButton}>
          <Ionicons name="bookmark-outline" size={20} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.engagementButton}>
          <Ionicons name="share-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Create Post Button */}
      <TouchableOpacity style={styles.createPostButton}>
        <Ionicons name="add-circle" size={24} color="#ffffff" />
        <Text style={styles.createPostText}>Share Your Experience</Text>
      </TouchableOpacity>

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => renderPostCard(item)}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#6366f1" />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No posts yet</Text>
          <Text style={styles.emptyStateSubtext}>Be the first to share your experience!</Text>
        </View>
      )}
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
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#6366f1',
    margin: 15,
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createPostText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  postCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  postExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 15,
  },
  engagementSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: 20,
  },
  engagementText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default CommunityScreen;
