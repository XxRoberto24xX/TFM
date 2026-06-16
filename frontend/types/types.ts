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

export interface getListFavoritesResponse {
  listFavoriteGasStation: gasStation[];
}

export interface getListGasStationsInRangeResponse {
  listGasStations: gasStation[];
}

export interface PlaceAutocompleteResponse {
  predictions: predicction[];
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
export interface getListFavoritesModel {
  gasStations: gasStationModel[];
}

export interface getListGasStationsInRangeModel {
  listGasStations: gasStationModel[];
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

/*
 *
 * FRONTEND DATA MODELS
 *
 */
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

export interface predicction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
