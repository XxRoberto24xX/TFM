import { AxiosResponse, create, InternalAxiosRequestConfig } from "axios";

const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1";

const googleClient = create({
  baseURL: GOOGLE_PLACES_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

googleClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google API Key is missing");
    }

    config.headers["X-Goog-Api-Key"] = apiKey;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

googleClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    let errorMessage = "Unknown error";
    let status = error.response?.status;

    if (error.response) {
      // The server responded but with an error
      errorMessage = error.response.data?.error?.message || `Google API Server Error (${status})`;
    } else if (error.request) {
      // The request was made but the server did not respond
      errorMessage = "Unable to connect to Google Places API. Check your internet connection.";
    } else {
      // The error was made by the frontend code and the request was not sent
      errorMessage = error.message;
    }

    console.error("❌ Google Places API Error:", errorMessage);

    return Promise.reject({
      message: errorMessage,
      status: status,
      code: error.code || "GOOGLE_API_ERROR",
    });
  },
);

export default googleClient;
