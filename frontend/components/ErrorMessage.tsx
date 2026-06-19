import { memo } from "react";
import { StyleSheet, View, type TextInputProps } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";

import ThemedText from "../components/ThemedText";

function ErrorMessage({ children, style, ...TextInputProps }: TextInputProps) {
  return (
    <View style={[styles.inlineError, style]}>
      <Ionicons
        name={"alert-circle"}
        size={15}
        color={Colors.textError}
      />
      <ThemedText
        size="s"
        color={Colors.textError}
        weight="regular">
        {children}
      </ThemedText>
    </View>
  );
}

export default memo(ErrorMessage);

const styles = StyleSheet.create({
  inlineError: {
    flexDirection: "row",
  },
});
