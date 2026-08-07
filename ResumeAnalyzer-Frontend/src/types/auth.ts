export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiration: string;
}

export interface RegisterResponse {
    message: string;
}