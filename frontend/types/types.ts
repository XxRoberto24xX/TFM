export type AutocompleteType = "origin" | "destiny";

export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}

/*
 *
 * FUNCTION RESPONSE STRUCTURES
 *
 */
export interface AuthResponse {
  token: string;
}

export interface GetListFavoritesResponse {
  listFavoriteGasStation: GasStation[];
}

export interface GetListGasStationsInRangeResponse {
  listGasStations: GasStation[];
}

export interface PlaceAutocompleteResponse {
  predictions: Predicction[];
}

export interface PlaceDetailsResponse {
  result: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  };
  status: string;
}

/*
 *
 * API RESPONSE MODELS
 *
 */
export interface GetListFavoritesModel {
  gasStations: GasStationModel[];
}

export interface GetListGasStationsInRangeModel {
  listGasStations: GasStationModel[];
}

export interface GasStationModel {
  id: number;
  hours: string;
  brand: string;
  direction: string;
  latitude: number;
  longitude: number;
  sellingType: string;
  municipality: string;
  prices?: Price;
}

/*
 *
 * FRONTEND DATA MODELS
 *
 */
export interface GasStation {
  id: number;
  hours: string;
  brand: string;
  direction: string;
  coordinates: Coordinates;
  sellingType: string;
  municipality: string;
  prices?: Price;
}

export interface Price {
  date: string;
  gasoline95: number;
  gasoline98: number;
  diesel: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Predicction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  coordinates?: Coordinates;
}

export interface RouteModel {
  routes: {
    polyline: {
      encodedPolyline: string;
    };
    distanceMeters: number;
    duration: string;
    legs: {
      startLocation: Coordinates;
      endLocation: Coordinates;
      distanceMeters: number;
      duration: string;
    }[];
  }[];
}

export interface RouteResponse {
  coordinates: Coordinates[];
  distanceKm: number;
  durationMinutes: number;
  durationText: string;
}
