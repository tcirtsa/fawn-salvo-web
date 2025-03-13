export interface Post {
    post_id: string;
    user_id: string;
    content: string;
    media_files?: string[];
    like_count: number;
    comment_count: number;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export interface CreatePostData {
    content: string;
    mediaFiles: File[];
}

export interface CreateCommentData {
    postId: string;
    content: string;
}