import BottomSheetAutocomplete from "@/components/BottomSheetAutocomplete";
import TextInputAutocomplete from "@/components/TextInputAutocomplete";
import MapRoutes from "@/components/MapRoutes";
import BottomSheet from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocationStore } from "@/stores/useLocationStore";
import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";

export default function Route() {
  const insets = useSafeAreaInsets();

  const userLocation = useLocationStore((state) => state.userLocation);

  const setQuery = useGoogleAutocompleteStore((state) => state.setQuery);
  const setOrigin = useGoogleAutocompleteStore((state) => state.setOrigin);

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (userLocation) {
      setOrigin({
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
      setQuery("origin", "Ubicación Actual");
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
        style={{ marginTop: 16 }}
        type="destiny"
        placeHolder="Destino"
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
