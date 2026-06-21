import { useCallback, useEffect, useRef } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet from "@gorhom/bottom-sheet";

import BottomSheetAutocomplete from "@/components/BottomSheetAutocomplete";
import IconFloatingButton from "@/components/IconFloatingButton";
import MapRoutes from "@/components/MapRoutes";
import TextInputAutocomplete from "@/components/TextInputAutocomplete";

import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";
import { useLocationStore } from "@/stores/useLocationStore";

import { Predicction } from "@/types/types";

const openGoogleMaps = (origin: Predicction, destination: Predicction) => {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.coordinates?.latitude},${origin.coordinates?.longitude}&destination=${destination.coordinates?.latitude},${destination.coordinates?.longitude}&travelmode=driving`;

  // Abrimos la URL
  Linking.openURL(url).catch((err) => {
    console.log("Error: No se pudo abrir Google Maps. Asegúrate de tener la app instalada.");
  });
};

export default function Route() {
  /* VARIABLES */
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const origin = useGoogleAutocompleteStore((state) => state.origin);
  const destiny = useGoogleAutocompleteStore((state) => state.destiny);

  const userLocation = useLocationStore((state) => state.userLocation);

  /* HANDLER */
  const handlerShareToGoogleMaps = useCallback(() => {
    if (origin && destiny) {
      openGoogleMaps(origin, destiny);
    } else {
      console.log("No hay ruta que compartir");
    }
  }, [origin, destiny]);

  /* WATCHERS */
  useEffect(() => {
    if (userLocation) {
      useGoogleAutocompleteStore.getState().setOrigin({
        place_id: "-1",
        description: "Mi ubicación actual",
        structured_formatting: {
          main_text: "Ubicación actual",
          secondary_text: "Basado en el GPS de tu dispositivo",
        },
        coordinates: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
      });
      useGoogleAutocompleteStore.getState().setQuery("origin", "Ubicación Actual");
    }
  }, [userLocation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapRoutes bottomSheetRef={bottomSheetRef} />
      <TextInputAutocomplete
        type="origin"
        placeHolder="Origen"
      />
      <TextInputAutocomplete
        style={{ marginTop: 16 }}
        type="destiny"
        placeHolder="Destino"
      />
      <IconFloatingButton
        style={{ margin: 16, alignSelf: "flex-end" }}
        imageSource={require("@/assets/icons/googleMaps.png")}
        onPress={handlerShareToGoogleMaps}
      />
      <BottomSheetAutocomplete bottomSheetRef={bottomSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 16,
  },
});
