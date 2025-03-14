import { api } from '@/utils/api';

export interface UserProfile {
    user_id: string;
    username: string;
    avatar_url?: string;
    bio?: string;
    created_at: string;
}

export interface UpdateProfileData {
    username?: string;
    bio?: string;
    avatar?: File;
}

export const userService = {
    async getCurrentUser() {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            throw error;
        }
    },

    async updateProfile(data: UpdateProfileData) {
        try {
            const formData = new FormData();
            if (data.username) formData.append('username', data.username);
            if (data.bio) formData.append('bio', data.bio);
            if (data.avatar) formData.append('avatar', data.avatar);

            const response = await api.put('/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    },

    async getUserProfile(userId: string) {
        try {
            const response = await api.get(`/user/${userId}/profile`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            throw error;
        }
    }
};