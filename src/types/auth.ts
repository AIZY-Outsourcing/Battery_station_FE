export interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "staff" | "user";
}

export interface Tokens {
    access_token: string;
    refresh_token: string;
}

export interface LoginResponse {
    data: {
        success: boolean;
        data: {
            user: User;
            tokens: Tokens;
        };
        statusCode: number;
        message: string;
        timestamp: string;
    }
}

export interface RefreshResponse {
    data: {
        success: boolean;
        data: {
            access_token: string;
        };
        statusCode: number;
        message: string;
        timestamp: string;
    }
}