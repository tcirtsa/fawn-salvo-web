'use client';

import { useParams } from 'next/navigation';
import UserProfile from '@/components/UserProfile';

export default function ProfilePage() {
    const params = useParams();
    const userId = params.userId as string;

    return (
        <div className="container mx-auto px-4 py-8">
            <UserProfile userId={userId} />
        </div>
    );
}