export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}

export interface AuthResponse {
  token: string;
}

export interface getListFavoritesModel {
  gasStations: gasStationModel[];
}

export interface getListGasStationsInRangeModel {
  listGasStations: gasStationModel[];
}

export interface getListFavoritesResponse {
  listFavoriteGasStation: gasStation[];
}

export interface getListGasStationsInRangeResponse {
  listGasStations: gasStation[];
}

export interface gasStationModel {
  id: number;
  hours: string;
  brand: string;
  direction: string;
  latitude: number;
  longitude: number;
  sellingType: string;
  municipality: string;
  prices?: price;
}

export interface gasStation {
  id: number;
  hours: string;
  brand: string;
  direction: string;
  coordinates: coordinates;
  sellingType: string;
  municipality: string;
  prices?: price;
}

export interface price {
  date: string;
  gasoline95: number;
  gasoline98: number;
  diesel: number;
}

export interface coordinates {
  latitude: number;
  longitude: number;
}
