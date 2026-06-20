import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { LongPressEvent, Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { useFocusEffect } from "expo-router";

import BottomSheet from "@gorhom/bottom-sheet";

import { useLocationStore } from "@/stores/useLocationStore";
import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";
import { computeRoute } from "@/services/api";
import { RouteResponse } from "@/types/types";
import { DEFAULT_REGION } from "@/constants/values";

interface Props {
  bottomSheetRef: RefObject<BottomSheet | null>;
}

function MapRoutes({ bottomSheetRef }: Props) {
  /* VARIABLES */
  const mapRef = useRef<MapView>(null);

  const [mapKey, setMapKey] = useState(0);
  const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);

  const lastRegion = useLocationStore.getState().lastRegion;
  const origin = useGoogleAutocompleteStore((state) => state.origin);
  const destiny = useGoogleAutocompleteStore((state) => state.destiny);

  const handleLongPress = (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    useGoogleAutocompleteStore.getState().setDestiny({
      place_id: "-2",
      description: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
      structured_formatting: {
        main_text: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
        secondary_text: "Ubicación seleccionada",
      },
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
    });
    useGoogleAutocompleteStore
      .getState()
      .setQuery("destiny", `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
  };

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
        try {
          const result = await computeRoute(originCoords, destinyCoords);
          setRouteResult(result);
        } catch (error) {
          console.error("Error calculando la ruta:", error);
        }

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
      onLongPress={handleLongPress}
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
