// services/googleRoutesClient.ts
import { AxiosResponse, create, InternalAxiosRequestConfig } from "axios";

const GOOGLE_ROUTES_API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

const googleRoutesClient = create({
  baseURL: GOOGLE_ROUTES_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

googleRoutesClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google API Key is missing");
    }

    config.headers["X-Goog-Api-Key"] = apiKey;

    // El field mask es obligatorio, lo establecemos por defecto
    if (!config.headers["X-Goog-FieldMask"]) {
      config.headers["X-Goog-FieldMask"] =
        "routes.polyline.encodedPolyline,routes.distanceMeters,routes.duration,routes.legs.startLocation,routes.legs.endLocation";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

googleRoutesClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    let errorMessage = "Unknown error";
    let status = error.response?.status;

    if (error.response) {
      // The server responded but with an error
      errorMessage = error.response.data?.error?.message || `Google Routes API Server Error (${status})`;
    } else if (error.request) {
      // The request was made but the server did not respond
      errorMessage = "Unable to connect to Google Routes API. Check your internet connection.";
    } else {
      // The error was made by the frontend code and the request was not sent
      errorMessage = error.message;
    }

    console.error("❌ Google Routes API Error:", errorMessage);

    return Promise.reject({
      message: errorMessage,
      status: status,
      code: error.code || "GOOGLE_ROUTES_API_ERROR",
    });
  },
);

export default googleRoutesClient;
