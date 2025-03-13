export interface User {
    id: string;
    username: string;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
}

export interface LoginCredentials {
    username: string;
    data: string;
}

export interface RegisterCredentials extends LoginCredentials {
    email: string;
}