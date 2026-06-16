import BottomSheetGoogleAutocomplete from "@/components/BottomSheetGoogleAutocomplete";
import InputGoogleAutocomplete from "@/components/InputGoogleAutocomplete";
import { StyleSheet, View } from "react-native";

export default function route() {
  return (
    <View style={styles.container}>
      <InputGoogleAutocomplete placeHolder="Origen" />
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
