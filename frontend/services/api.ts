import apiClient from "./client";
import {
  AuthResponse,
  coordinates,
  getListFavoritesModel,
  getListFavoritesResponse,
  getListGasStationsInRangeModel,
  getListGasStationsInRangeResponse,
  PlaceAutocompleteResponse,
} from "../types/types";
import { mapGasStationModelToFrontend, mapPlaceAutocompleteResponseToFrontend } from "@/utils/mappers";
import googleClient from "./googleClient";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    { email, password },
    { context: { skipAuth: true } },
  );
  return response.data;
}

export async function register(email: string, password: string): Promise<void> {
  const response = await apiClient.post<void>("/auth/register", { email, password }, { context: { skipAuth: true } });
  return response.data;
}

export async function passwordResetEmail(email: string): Promise<void> {
  const response = await apiClient.post<void>("/auth/passwordResetEmail", { email });
  return response.data;
}

export async function getListFavorites(): Promise<getListFavoritesResponse> {
  const response = await apiClient.get<getListFavoritesModel>("/gasStations/getListFavorites");
  return {
    listFavoriteGasStation: response.data.gasStations.map(mapGasStationModelToFrontend),
  };
}

export async function addToFavorites(gasStationId: number): Promise<void> {
  const response = await apiClient.post<void>("/gasStations/addToFavorites", { gasStationId });
  return response.data;
}

export async function removeFromFavorites(gasStationId: number): Promise<void> {
  const response = await apiClient.post<void>("/gasStations/removeFromFavorites", { gasStationId });
  return response.data;
}

export async function getGasStationsInRange(
  north: number,
  south: number,
  east: number,
  west: number,
): Promise<getListGasStationsInRangeResponse> {
  const response = await apiClient.post<getListGasStationsInRangeModel>("/gasStations/getGasStationsInRange", {
    north,
    south,
    east,
    west,
  });
  return {
    listGasStations: response.data.listGasStations.map(mapGasStationModelToFrontend),
  };
}

export async function getPlaceAutocomplete(input: string, sessionToken: string): Promise<PlaceAutocompleteResponse> {
  const response = await googleClient.post(
    "/places:autocomplete",
    {
      input: input,
      sessionToken: sessionToken,
      //includedRegionCodes: ["es"],
      languageCode: "es",
    },
    {
      headers: {
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text",
      },
    },
  );

  return {
    predictions: mapPlaceAutocompleteResponseToFrontend(response.data),
  };
}

export async function getPlaceCoordinates(placeId: string, sessionToken: string): Promise<coordinates> {
  const response = await googleClient.get(`/places/${placeId}`, {
    params: {
      sessionToken: sessionToken,
      languageCode: "es",
    },
    headers: {
      "X-Goog-FieldMask": "location",
    },
  });

  return {
    latitude: response.data.location.latitude,
    longitude: response.data.location.longitude,
  };
}
