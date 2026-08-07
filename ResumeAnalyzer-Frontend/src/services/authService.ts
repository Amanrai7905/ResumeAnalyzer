import apiClient from "../api/apiClient";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from "../types/auth";

export const loginUser = async (
    data: LoginRequest
): Promise<LoginResponse> => {

    const response = await apiClient.post<LoginResponse>(
        "/Auth/login",
        data
    );

    return response.data;
};

export const Userregister = async (
    data: RegisterRequest
): Promise<RegisterResponse> => {

    const response = await apiClient.post<RegisterResponse>(
        "/Auth/register",
        data
    );

    return response.data;
};