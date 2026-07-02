import polyline from "@mapbox/polyline";

import {
  AuthResponse,
  Coordinates,
  GetListFavoritesModel,
  GetListFavoritesResponse,
  GetListGasStationsInRangeModel,
  GetListGasStationsInRangeResponse,
  GetListGasStationsInRouteResponse,
  PlaceAutocompleteResponse,
  RouteModel,
  RouteResponse,
} from "../types/types";
import apiClient from "./client";
import googleClient from "./googlePlacesClient";
import googleRoutesClient from "./googleRoutesClient";

import { formatDuration, parseDuration } from "@/utils/gasStationsUtils";
import { mapGasStationModelToFrontend, mapPlaceAutocompleteResponseToFrontend } from "@/utils/mappers";

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

export async function getListFavorites(): Promise<GetListFavoritesResponse> {
  const response = await apiClient.get<GetListFavoritesModel>("/gasStations/getListFavorites");
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
): Promise<GetListGasStationsInRangeResponse> {
  const response = await apiClient.post<GetListGasStationsInRangeModel>("/gasStations/getGasStationsInRange", {
    north,
    south,
    east,
    west,
  });

  return {
    listGasStations: response.data.listGasStations.map(mapGasStationModelToFrontend),
    priceMargins: response.data.priceSummary,
  };
}

export async function getGasStationsInRoute(
  coordinates: Coordinates[],
  distance: number,
): Promise<GetListGasStationsInRouteResponse> {
  const response = await apiClient.post<GetListGasStationsInRangeModel>("/gasStations/getGasStationsInRoute", {
    coordinates,
    distance,
  });
  return {
    listGasStations: response.data.listGasStations.map(mapGasStationModelToFrontend),
    priceMargins: response.data.priceSummary,
  };
}

export async function getPlaceAutocomplete(input: string, sessionToken: string): Promise<PlaceAutocompleteResponse> {
  const response = await googleClient.post(
    "/places:autocomplete",
    {
      input: input,
      sessionToken: sessionToken,
      includedRegionCodes: ["es"],
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

export async function getPlaceCoordinates(placeId: string, sessionToken: string): Promise<Coordinates> {
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

export async function computeRoute(origin: Coordinates, destination: Coordinates): Promise<RouteResponse> {
  const response = await googleRoutesClient.post<RouteModel>(
    "",
    {
      origin: {
        location: {
          latLng: {
            latitude: origin.latitude,
            longitude: origin.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
    },
    {
      headers: {
        "X-Goog-FieldMask":
          "routes.polyline.encodedPolyline,routes.distanceMeters,routes.duration,routes.legs.startLocation,routes.legs.endLocation",
      },
    },
  );

  if (!response.data?.routes || response.data.routes.length === 0) {
    throw new Error("No se encontró ninguna ruta para los puntos proporcionados");
  }

  const route = response.data.routes[0];
  const decodedPoints = polyline.decode(route.polyline.encodedPolyline).map((point: number[]) => ({
    latitude: point[0],
    longitude: point[1],
  }));

  return {
    coordinates: decodedPoints,
    distanceKm: route.distanceMeters / 1000,
    durationMinutes: Math.round(parseDuration(route.duration) / 60),
    durationText: formatDuration(Math.round(parseDuration(route.duration) / 60)),
  };
}

export async function computeRouteWithWaypoints(
  origin: Coordinates,
  destination: Coordinates,
  waypoints: Coordinates[],
): Promise<RouteResponse> {
  const intermediates = waypoints.map((point) => ({
    location: {
      latLng: {
        latitude: point.latitude,
        longitude: point.longitude,
      },
    },
  }));

  const response = await googleRoutesClient.post<RouteModel>(
    "",
    {
      origin: {
        location: {
          latLng: {
            latitude: origin.latitude,
            longitude: origin.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
        },
      },
      intermediates: intermediates,
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
    },
    {
      headers: {
        "X-Goog-FieldMask": "routes.polyline.encodedPolyline,routes.distanceMeters,routes.duration",
      },
    },
  );

  const route = response.data.routes[0];
  const decodedPoints = polyline.decode(route.polyline.encodedPolyline).map((point: number[]) => ({
    latitude: point[0],
    longitude: point[1],
  }));

  return {
    coordinates: decodedPoints,
    distanceKm: route.distanceMeters / 1000,
    durationMinutes: Math.round(parseDuration(route.duration) / 60),
    durationText: formatDuration(Math.round(parseDuration(route.duration) / 60)),
  };
}
