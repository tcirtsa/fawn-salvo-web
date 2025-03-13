import axios from 'axios';

const API_BASE_URL = 'http://localhost:7878';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('token='));
    const token = tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : null;

    // 如果请求数据是FormData，不设置Content-Type，让浏览器自动设置
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        document.cookie = `token=${token}; path=/; max-age=604800; secure; samesite=strict`;
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        delete api.defaults.headers.common.Authorization;
    }
};