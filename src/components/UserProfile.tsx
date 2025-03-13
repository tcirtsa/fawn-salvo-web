'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { authService } from '@/services/auth';

interface UserProfileProps {
    userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        loadUserInfo();
    }, [userId]);

    const loadUserInfo = async () => {
        try {
            const userData = await authService.getUserInfo(userId);
            setUser(userData);
        } catch (error) {
            console.error('Failed to load user info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('图片大小不能超过5MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('请上传图片文件');
            return;
        }

        setAvatarFile(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        try {
            const formData = new FormData();
            formData.append('avatar', file);
            await authService.updateAvatar(formData);
            await loadUserInfo();
        } catch (error: any) {
            setError(error.message || '上传头像失败');
        } finally {
            URL.revokeObjectURL(previewUrl);
            setPreview(null);
            setAvatarFile(null);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={preview || user.avatar || '/default-avatar.png'}
                        alt={user.username}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </label>
                </div>
                <div>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-600">User ID: {user.id}</p>
                </div>
            </div>
            {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
        </div>
    );
}