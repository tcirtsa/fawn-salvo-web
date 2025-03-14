'use client';

import { useEffect, useState } from 'react';
import UserProfile from '@/components/UserProfile';
import { userService } from '@/services/user';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function ProfilePage() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const user = await userService.getCurrentUser();
                setUserId(user.user_id);
            } catch (error) {
                console.error('Failed to load current user:', error);
            }
        };
        loadCurrentUser();
    }, []);

    return (
        <ErrorBoundary fallback={<div className="text-red-600 p-4">页面出现错误，请刷新重试</div>}>
            <main className="min-h-screen p-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">个人资料</h1>
                    {userId && <UserProfile userId={userId} isEditable={true} />}
                </div>
            </main>
        </ErrorBoundary>
    );
}