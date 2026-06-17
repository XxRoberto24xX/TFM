import BottomSheetGoogleAutocomplete from "@/components/BottomSheetGoogleAutocomplete";
import InputGoogleAutocomplete from "@/components/InputGoogleAutocomplete";
import MapRoutes from "@/components/MapRoutes";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Route() {
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapRoutes bottomSheetRef={bottomSheetRef} />
      <InputGoogleAutocomplete
        type="origin"
        placeHolder="Origen"
      />
      <InputGoogleAutocomplete
        style={{ marginTop: 16 }}
        type="destiny"
        placeHolder="Destino"
      />
      <BottomSheetGoogleAutocomplete bottomSheetRef={bottomSheetRef} />
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
