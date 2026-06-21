import * as SecureStore from "expo-secure-store";

import { AxiosResponse, create, InternalAxiosRequestConfig } from "axios";

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
      const token = await SecureStore.getItemAsync("token");

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
    let errorMessage;
    let status = error.response?.status;

    if (error.response) {
      // The server responded but with an error
      errorMessage = error.response.data?.message || `Server Error (${status})`;
    } else if (error.request) {
      // The request was made but the server did not respond

      // If the server responded with a 401, it means the token is invalid or expired, so we clear it from storage so the user can introduce again their credentials
      if (status === 401) {
        await SecureStore.deleteItemAsync("token");
      }

      errorMessage = "Unnable to connect to the server. Please check your internet connection.";
    } else {
      // The error was made by the frontend code and the request was not sent
      errorMessage = error.message;
    }

    return Promise.reject({
      message: errorMessage,
      status: status,
      code: error.code,
    });
  },
);

export default apiClient;
