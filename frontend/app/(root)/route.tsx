import BottomSheetGoogleAutocomplete from "@/components/BottomSheetGoogleAutocomplete";
import InputGoogleAutocomplete from "@/components/InputGoogleAutocomplete";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Route() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <InputGoogleAutocomplete
        type="origin"
        placeHolder="Origen"
      />
      <InputGoogleAutocomplete
        style={{ marginTop: 16 }}
        type="destiny"
        placeHolder="Destino"
      />
      <BottomSheetGoogleAutocomplete />
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
