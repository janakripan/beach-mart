import axios from "axios";
import { useAuthStore } from "../pages/Auth/store/AuthStore";


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Attach JWT if available
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // If refresh itself fails → logout
    if (originalRequest.url?.includes("/refresh-token")) {
      useAuthStore.getState().logout();
      window.location.replace("/");
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      useAuthStore.getState().logout();
      window.location.replace("/");
      return Promise.reject(error);
    }

    const authStore = useAuthStore.getState();
    const refreshToken = authStore.refreshToken;

    if (!refreshToken) {
      authStore.logout();
      window.location.replace("/");
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/refresh-token`,
        { refreshToken }
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
        refreshTokenExpiry,
      } = res.data.data;

      authStore.loginSuccess(
        accessToken,
        newRefreshToken,
        refreshTokenExpiry,
        authStore.user
      );

      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      authStore.logout();
      window.location.replace("/");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
