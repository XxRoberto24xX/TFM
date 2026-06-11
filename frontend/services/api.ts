import apiClient from "./client";
import {
  AuthResponse,
  getListFavoritesModel,
  getListFavoritesResponse,
  getListGasStationsInRangeModel,
  getListGasStationsInRangeResponse,
} from "../types/types";
import { mapGasStationModelToFrontend } from "@/utils/mappers";

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
