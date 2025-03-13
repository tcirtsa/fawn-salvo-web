import { api } from '@/utils/api';
import { CreatePostData, CreateCommentData } from '@/types/post';

export const postService = {
    async getPosts(page: number = 1, userId?: number) {
        try {
            let url = '/posts';
            const params: Record<string, any> = { page };

            if (userId) {
                url = '/get_user_posts';
                params.user_id = userId;
            }

            const response = await api.get(url, { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            throw error;
        }
    },

    async createPost(data: CreatePostData) {
        try {
            const formData = new FormData();
            formData.append('content', data.content);

            if (data.mediaFiles && Array.isArray(data.mediaFiles) && data.mediaFiles.length > 0) {
                data.mediaFiles.forEach(file => {
                    formData.append('media_files', file);
                });
            }

            const response = await api.post('/posts/add_post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create post:', error);
            throw error;
        }
    },

    async getComments(postId: string, page: number = 1) {
        try {
            const response = await api.get(`/posts/${postId}/comment`, {
                params: { page }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            throw error;
        }
    },

    async createComment(data: CreateCommentData) {
        try {
            const response = await api.post(`/posts/${data.postId}/comment/add_comment`, {
                content: data.content
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create comment:', error);
            throw error;
        }
    },

    async likePost(postId: string, userId: string) {
        try {
            const response = await api.post(`/posts/${postId}/like/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to like post:', error);
            throw error;
        }
    }
};