export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}

export interface AuthResponse {
  token: string;
}

export interface getListFavoritesModel {
  gasStations: gasStation[];
}

export interface gasStation {
  id: number;
  hours?: string;
  brand: string;
  direction: string;
  latitude?: number;
  longitude?: number;
  sellingType?: string;
  municipality: string;
}
