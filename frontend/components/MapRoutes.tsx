import { StyleSheet } from "react-native";
import { memo, RefObject, useCallback, useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useFocusEffect } from "expo-router";
import { DEFAULT_REGION } from "@/constants/values";
import { useLocationStore } from "@/stores/useLocationStore";
import BottomSheet from "@gorhom/bottom-sheet";
import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";

interface Props {
  bottomSheetRef: RefObject<BottomSheet | null>;
}

const MapRoutes = ({ bottomSheetRef }: Props) => {
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef<MapView>(null);

  const lastRegion = useLocationStore.getState().lastRegion;
  const origin = useGoogleAutocompleteStore((state) => state.origin);
  const destiny = useGoogleAutocompleteStore((state) => state.destiny);

  useEffect(() => {
    const map = mapRef?.current;
    if (!map) return;

    const originCoords = origin?.coordinates;
    const destinyCoords = destiny?.coordinates;

    if (originCoords && destinyCoords) {
      map.fitToCoordinates([originCoords, destinyCoords], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
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
  }, [origin?.coordinates, destiny?.coordinates, mapKey, mapRef]);

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
    </MapView>
  );
};

export default memo(MapRoutes);
