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

export interface getListGasStationsInRangeModel {
  listGasStations: gasStationWithPrice[];
}

export interface gasStation {
  id: number;
  hours: string;
  brand: string;
  direction: string;
  latitude: number;
  longitude: number;
  sellingType: string;
  municipality: string;
}

export interface gasStationWithPrice {
  id: number;
  hours: string;
  brand: string;
  direction: string;
  latitude: number;
  longitude: number;
  sellingType: string;
  municipality: string;
  prices: price;
}

export interface price {
  date: string;
  gasoline95: number;
  gasoline98: number;
  diesel: number;
}
