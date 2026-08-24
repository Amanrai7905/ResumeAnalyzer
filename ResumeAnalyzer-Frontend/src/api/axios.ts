import axios from "axios";
import { storage } from "../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired Access Token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = storage.getRefreshToken();

      if (!refreshToken) {
        storage.clear();
        window.location.href = "/login";

        return Promise.reject(error);
      }

      try {
        // Call refresh-token API
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/Auth/refresh`,
          {
            refreshToken: refreshToken,
          }
        );

        const {
          accessToken,
          refreshToken: newRefreshToken,
        } = response.data;

        // Save new tokens
        storage.setAccessToken(accessToken);
        storage.setRefreshToken(newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization =
          `Bearer ${accessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        // Refresh token is also invalid/expired
        storage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;