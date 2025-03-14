'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { authService } from '@/services/auth';
import { userService } from '@/services/user';
import { UpdateProfileData } from '@/services/user';

interface UserProfileProps {
    userId: string;
    isEditable?: boolean;
}

export default function UserProfile({ userId }: UserProfileProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [bioCharCount, setBioCharCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        loadUserInfo();
    }, [userId]);

    const loadUserInfo = async () => {
        try {
            const userData = await authService.getUserInfo(userId);
            const userProfile = await userService.getUserProfile(userId);
            setUser(userData);
            setBio(userProfile.bio || '');
        } catch (error) {
            console.error('Failed to load user info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setUploadProgress(0);
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
        setIsAvatarUploading(true);

        try {
            const updateData: UpdateProfileData = { avatar: file };
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            };
            await userService.updateProfile(updateData);
            await loadUserInfo();
        } catch (error: any) {
            setError(error.message || '上传头像失败');
        } finally {
            URL.revokeObjectURL(previewUrl);
            setPreview(null);
            setAvatarFile(null);
            setIsAvatarUploading(false);
            setUploadProgress(0);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <div>User not found</div>;
    }

    const handleBioUpdate = async () => {
        try {
            const updateData: UpdateProfileData = { bio };
            await userService.updateProfile(updateData);
            setIsEditing(false);
            await loadUserInfo();
        } catch (error: any) {
            setError(error.message || '更新简介失败');
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={preview || user.avatar || '/default-avatar.png'}
                        alt={user.username}
                        className={`w-20 h-20 rounded-full object-cover transition-opacity duration-200 ${isAvatarUploading ? 'opacity-50' : ''}`}
                    />
                    <label className={`absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer transition-opacity duration-200 ${isAvatarUploading ? 'opacity-50' : 'hover:bg-blue-600'}`}>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                            disabled={isAvatarUploading}
                        />
                        {isAvatarUploading ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
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
                        )}
                    </label>
                    {isAvatarUploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full">
                            <div className="relative w-16 h-16">
                                <svg className="animate-spin w-16 h-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">{uploadProgress}%</span>
                                </div>
                            </div>
                            <span className="mt-2 text-sm text-white font-medium">上传中...</span>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-600">User ID: {user.id}</p>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">个人简介</h3>
                {isEditing ? (
                    <div className="space-y-2">
                        <div className="relative">
                            <textarea
                                value={bio}
                                onChange={(e) => {
                                    const text = e.target.value;
                                    if (text.length <= 500) {
                                        setBio(text);
                                        setBioCharCount(text.length);
                                    }
                                }}
                                className="w-full p-2 border rounded-md"
                                rows={3}
                                placeholder="写点什么介绍一下自己吧..."
                                maxLength={500}
                            />
                            <span className="absolute bottom-2 right-2 text-sm text-gray-500">{bioCharCount}/500</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleBioUpdate}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                            >
                                保存
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setBio(user?.bio || '');
                                    setBioCharCount(user?.bio?.length || 0);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="group relative">
                        <p className="text-gray-600">{bio || '这个人很懒，什么都没写~'}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-600"
                        >
                            编辑
                        </button>
                    </div>
                )}
            </div>
            {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
        </div>
    );
}