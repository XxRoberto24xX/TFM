import { StyleSheet } from "react-native";
import { memo, Ref, RefObject, useCallback, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useFocusEffect } from "expo-router";
import { DEFAULT_REGION } from "@/constants/values";
import { useLocationStore } from "@/stores/useLocationStore";
import BottomSheet from "@gorhom/bottom-sheet";
import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";

interface Props {
  ref?: Ref<MapView>;
  bottomSheetRef: RefObject<BottomSheet | null>;
}

const MapRoutes = ({ ref, bottomSheetRef }: Props) => {
  const [mapKey, setMapKey] = useState(0);

  const lastRegion = useLocationStore.getState().lastRegion;
  const origin = useGoogleAutocompleteStore((state) => state.origin);
  const destiny = useGoogleAutocompleteStore((state) => state.destiny);

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
      ref={ref}
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
