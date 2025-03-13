import { api, setAuthToken } from '../utils/api';
import { LoginCredentials, RegisterCredentials, User } from '@/types/auth';

export const authService = {
    async login(credentials: LoginCredentials) {
        try {
            console.log('发送登录请求:', credentials);
            const response = await api.post('/login', credentials);
            console.log('登录响应:', response.data);
            if (typeof response.data === 'string') {
                const token = response.data;
                setAuthToken(token);
                return { token };
            }
            throw new Error('无效的登录响应格式');
        } catch (error: any) {
            console.error('登录失败:', error);
            if (error.response?.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    },

    async register(credentials: RegisterCredentials) {
        const response = await api.post('/register', credentials);
        return response.data;
    },

    async getCurrentUser() {
        const response = await api.get('/user/auth');
        return response.data;
    },

    async updateAvatar(formData: FormData) {
        const response = await api.post('/user/updata_head', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async getUserInfo(userId: string) {
        const response = await api.post('/user/get_user', { userId });
        return response.data;
    },
};