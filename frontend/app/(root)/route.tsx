import { useCallback, useEffect, useRef } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import BottomSheet from "@gorhom/bottom-sheet";

import BottomSheetAutocomplete from "@/components/BottomSheetAutocomplete";
import ChipsFilterBrands from "@/components/ChipsFilterBrands";
import ChipsFilterGas from "@/components/ChipsFilterGas";
import FloatingButtonIcon from "@/components/FloatingButtonIcon";
import MapRoutes from "@/components/MapRoutes";
import TextInputAutocomplete from "@/components/TextInputAutocomplete";

import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";
import { useLocationStore } from "@/stores/useLocationStore";

import { Predicction } from "@/types/types";

const openGoogleMaps = (origin: Predicction, destination: Predicction) => {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.coordinates?.latitude},${origin.coordinates?.longitude}&destination=${destination.coordinates?.latitude},${destination.coordinates?.longitude}&travelmode=driving`;

  Linking.openURL(url).catch((err) => {
    console.log("Error: No se pudo abrir Google Maps. Asegúrate de tener la app instalada.");
  });
};

export default function Route() {
  /* VARIABLES */
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  /* HANDLER */
  const onShareToGoogleMaps = useCallback(() => {
    const origin = useGoogleAutocompleteStore.getState().origin;
    const destiny = useGoogleAutocompleteStore.getState().destiny;

    if (origin && destiny) {
      openGoogleMaps(origin, destiny);
    } else {
      console.log("No hay ruta que compartir");
    }
  }, []);

  const onGoBack = useCallback(() => {
    useGoogleAutocompleteStore.getState().resetStore();
    router.back();
  }, []);

  /* WATCHERS */
  useEffect(() => {
    const userLocation = useLocationStore.getState().userLocation;

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
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapRoutes bottomSheetRef={bottomSheetRef} />
      <TextInputAutocomplete
        type="origin"
        placeHolder="Origen"
      />
      <TextInputAutocomplete
        style={styles.destination}
        type="destiny"
        placeHolder="Destino"
      />
      <ChipsFilterBrands />
      <FloatingButtonIcon
        style={styles.googleMapsButton}
        imageSource={require("@/assets/icons/googleMaps.png")}
        onPress={onShareToGoogleMaps}
      />
      <FloatingButtonIcon
        style={styles.googleMapsButton}
        icon="arrow-back"
        onPress={onGoBack}
      />
      <View style={styles.bottomView}>
        <ChipsFilterGas />
      </View>
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
  destination: {
    marginTop: 16,
  },
  googleMapsButton: {
    margin: 16,
    alignSelf: "flex-end",
  },
  bottomView: {
    marginTop: "auto",
  },
});
