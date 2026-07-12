export type AutocompleteType = "origin" | "destiny";
export type FuelType =
  | "gasoline95"
  | "gasoline98"
  | "diesel"
  | "dieselPremium"
  | "gasoline95Premium"
  | "dieselRenewable"
  | "glp";

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
  accessToken: string;
  refreshToken: string;
}

export interface GetListFavoritesResponse {
  listFavoriteGasStation: GasStation[];
}

export interface GetListGasStationsInRangeResponse {
  listGasStations: GasStation[];
  priceMargins: {
    gasoline95: Margin;
    gasoline98: Margin;
    diesel: Margin;
    glp: Margin;
    dieselPremium: Margin;
    gasoline95Premium: Margin;
    dieselRenewable: Margin;
  };
}

export interface GetListGasStationsInRouteResponse {
  listGasStations: GasStation[];
  priceMargins: {
    gasoline95: Margin;
    gasoline98: Margin;
    diesel: Margin;
    glp: Margin;
    dieselPremium: Margin;
    gasoline95Premium: Margin;
    dieselRenewable: Margin;
  };
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
  priceSummary: {
    gasoline95: Margin;
    gasoline98: Margin;
    diesel: Margin;
    glp: Margin;
    dieselPremium: Margin;
    gasoline95Premium: Margin;
    dieselRenewable: Margin;
  };
}

export interface GetListGasStationsInRouteResponseModel {
  listGasStations: GasStationModel[];
  priceMargins: {
    gasoline95: Margin;
    gasoline98: Margin;
    diesel: Margin;
    glp: Margin;
    dieselPremium: Margin;
    gasoline95Premium: Margin;
    dieselRenewable: Margin;
  };
}

export interface GetHistoricalPricesResponseModel {
  historicalPrices: Price[];
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
  dieselPremium: number;
  gasoline95Premium: number;
  dieselRenewable: number;
  glp: number;
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

export interface Margin {
  min: number;
  max: number;
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
