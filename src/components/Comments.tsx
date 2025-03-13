'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/types/post';
import { postService } from '@/services/post';

interface CommentsProps {
    postId: string;
}

export default function Comments({ postId }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        loadComments();
    }, [postId]);

    const loadComments = async (pageNum = 1) => {
        try {
            const data = await postService.getComments(postId, pageNum);
            if (pageNum === 1) {
                setComments(data);
                setPage(1);
            } else {
                setComments(prev => [...prev, ...data]);
            }
            setHasMore(data.length === 10);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await postService.createComment({
                postId,
                content: newComment
            });
            setNewComment('');
            loadComments(1); // 重新加载评论
        } catch (error) {
            console.error('Failed to create comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadMore = () => {
        if (!hasMore || isLoading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        loadComments(nextPage);
    };

    if (isLoading && page === 1) {
        return <div className="p-4 text-center">加载评论中...</div>;
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="发表评论..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? '发送中...' : '发送'}
                </button>
            </form>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{comment.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            {new Date(comment.created_at).toLocaleString()}
                        </p>
                    </div>
                ))}

                {hasMore && (
                    <button
                        onClick={loadMore}
                        className="w-full p-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        加载更多评论
                    </button>
                )}
            </div>
        </div>
    );
}