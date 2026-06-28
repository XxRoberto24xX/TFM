import * as SecureStore from "expo-secure-store";

import axios, { AxiosResponse, create, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const apiClient = create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.context?.skipAuth) {
      return config;
    }

    try {
      const token = await SecureStore.getItemAsync("accessToken");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error al recuperar el token de autenticación", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    let errorMessage;
    let status = error.response?.status;

    if (error.response) {
      // THE SERVER RESPONDED BUT WITH AN ERROR CODE
      errorMessage = error.response.data?.message || `Server Error (${status})`;

      if ((status === 401 || status === 403) && !originalRequest._retry) {
        // THE ERROR CODE WAS A FORBIDEN ONE SO THE ACCESS TOKEN IS THE RESPONSIBLE
        originalRequest._retry = true;

        try {
          const currentRefreshToken = await SecureStore.getItemAsync("refreshToken");

          if (currentRefreshToken) {
            // making the request here we avoid passing our own interceptors
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken: currentRefreshToken,
            });

            if (response.status === 200) {
              const { accessToken, refreshToken: newRefreshToken } = response.data;

              await SecureStore.setItemAsync("accessToken", accessToken);
              await SecureStore.setItemAsync("refreshToken", newRefreshToken);

              // we modify the original reques header, rewite the new accesstoken and make the reques again
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return apiClient(originalRequest);
            }
          }
        } catch (refreshError) {
          // THE REFRESH TOKEN IS ALSO EXPIRED AND THE LOGIN NEEDS TO ME MADE AGAIN
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");

          errorMessage = "Your session has expired. Please log in again.";
        }
      }
    } else if (error.request) {
      // THE REQUEST WAS MADE BUT THE SERVER DID NOT RESPOND
      errorMessage = "Unable to connect to the server. Please check your internet connection.";
    } else {
      // THE ERROR WAS MADE BY THE FRONTEND CODE AND THE REQUEST WAS NOT SEND
      errorMessage = error.message;
    }

    // Devolvemos el error formateado tal cual lo espera tu estructura actual
    return Promise.reject({
      message: errorMessage,
      status: status,
      code: error.code,
    });
  },
);

export default apiClient;
