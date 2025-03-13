'use client';

import { useEffect, useState, useCallback } from 'react';
import { Post } from '@/types/post';
import { postService } from '@/services/post';
import CreatePost from '@/components/CreatePost';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async (pageNum = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await postService.getPosts(pageNum);
      setPosts(prevPosts => pageNum === 1 ? data : [...prevPosts, ...data]);
    } catch (error: any) {
      console.error('Failed to fetch posts:', error);
      setError(error.message || '加载失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handleCreatePost = useCallback(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading]);

  const renderContent = () => {
    if (isLoading && posts.length === 0) {
      return (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      );
    }

    if (error && posts.length === 0) {
      return (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.post_id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-800">{post.content}</p>
            {post.media_files && post.media_files.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {post.media_files.map((url, index) => (
                  <img
                    key={`${post.post_id}-${index}`}
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center space-x-4 text-gray-600">
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <span>👍</span>
                <span>{post.like_count}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <span>💬</span>
                <span>{post.comment_count}</span>
              </button>
            </div>
          </div>
        ))}
        {!isLoading && !error && (
          <button
            onClick={handleLoadMore}
            className="w-full p-4 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            加载更多
          </button>
        )}
        {isLoading && posts.length > 0 && (
          <div className="text-center p-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ErrorBoundary fallback={<div className="text-red-600 p-4">页面出现错误，请刷新重试</div>}>
      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">动态列表</h1>
          <CreatePost onSuccess={handleCreatePost} />
          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}

