import React, { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";

import FloatingButton from "./layouts/FloatingButton";
import ThemedText from "./ThemedText";

interface Props {
  text: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  iconProvider?: "comunity" | "material";
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const FloatingButtonText = ({ icon, iconProvider = "material", text, style, onPress }: Props) => {
  return (
    <FloatingButton
      style={style}
      onPress={onPress}>
      <View style={styles.container}>
        {icon &&
          (iconProvider === "material" ? (
            <MaterialIcons
              name={icon as keyof typeof MaterialIcons.glyphMap}
              size={24}
              color={Colors.textPrimary}
            />
          ) : (
            <MaterialCommunityIcons
              name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={24}
              color={Colors.textPrimary}
            />
          ))}
        <ThemedText
          style={styles.text}
          size="xl">
          {text}
        </ThemedText>
      </View>
    </FloatingButton>
  );
};

export default memo(FloatingButtonText);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    minWidth: 200,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    textAlign: "center",
  },
});
