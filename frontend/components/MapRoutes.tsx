import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { useFocusEffect } from "expo-router";

import BottomSheet from "@gorhom/bottom-sheet";

import { useLocationStore } from "@/stores/useLocationStore";
import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";
import { computeRoute } from "@/services/api";
import { coordinates, RouteResponse } from "@/types/types";
import { DEFAULT_REGION } from "@/constants/values";

interface Props {
  bottomSheetRef: RefObject<BottomSheet | null>;
}

function MapRoutes({ bottomSheetRef }: Props) {
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef<MapView>(null);

  const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const lastRegion = useLocationStore.getState().lastRegion;
  const origin = useGoogleAutocompleteStore((state) => state.origin);
  const destiny = useGoogleAutocompleteStore((state) => state.destiny);

  const calculateRoute = useCallback(async (origin: coordinates, destination: coordinates) => {
    setIsLoading(true);

    try {
      const result = await computeRoute(origin, destination);
      setRouteResult(result);
    } catch (error) {
      console.error("Error calculando la ruta:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const safeCoordinates = useMemo(() => {
    return routeResult?.coordinates ? [...routeResult.coordinates] : [];
  }, [routeResult]);

  useEffect(() => {
    const animationAndRouting = async () => {
      const map = mapRef?.current;
      if (!map) return;

      setRouteResult(null);

      const originCoords = origin?.coordinates;
      const destinyCoords = destiny?.coordinates;

      if (originCoords && destinyCoords) {
        await calculateRoute(originCoords, destinyCoords);
        map.fitToCoordinates([originCoords, destinyCoords], {
          edgePadding: { top: 250, right: 100, bottom: 100, left: 100 },
          animated: true,
        });
      } else if (originCoords) {
        map.animateToRegion(
          {
            latitude: originCoords.latitude,
            longitude: originCoords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          1000,
        );
      } else if (destinyCoords) {
        map.animateToRegion(
          {
            latitude: destinyCoords.latitude,
            longitude: destinyCoords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          1000,
        );
      }
    };

    animationAndRouting();
  }, [origin, destiny]);

  /* ON ACTIVE */
  useFocusEffect(
    useCallback(() => {
      setMapKey((k) => k + 1);
    }, []),
  );

  return (
    <MapView
      style={StyleSheet.absoluteFill}
      key={mapKey}
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
      onPress={() => bottomSheetRef.current?.close()}
      onPoiClick={() => {
        bottomSheetRef.current?.close();
      }}
      initialRegion={lastRegion ?? DEFAULT_REGION}>
      {origin?.coordinates && (
        <Marker
          coordinate={origin.coordinates}
          title="Origen"
          description={origin.description}
          pinColor="blue"
        />
      )}

      {/* 3. Marcador para el Destino (Morado) */}
      {destiny?.coordinates && (
        <Marker
          coordinate={destiny.coordinates}
          title="Destino"
          description={destiny.description}
          pinColor="purple"
        />
      )}

      {safeCoordinates && (
        <Polyline
          coordinates={safeCoordinates}
          strokeColor="#ff0000"
          strokeWidth={4}
        />
      )}
    </MapView>
  );
}

export default memo(MapRoutes);
