import React, { memo } from "react";
import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";

import FloatingButton from "./layouts/FloatingButton";

interface Props {
  icon?: keyof typeof Ionicons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  iconProvider?: "ionicons" | "material";
  imageSource?: ImageSourcePropType | null;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const FloatingButtonText = ({ icon, iconProvider, imageSource, style, onPress }: Props) => {
  return (
    <FloatingButton
      style={style}
      onPress={onPress}>
      <View style={styles.container}>
        {imageSource ? (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={imageSource}
            />
          </View>
        ) : iconProvider === "material" ? (
          <MaterialIcons
            name={icon as keyof typeof MaterialIcons.glyphMap}
            size={26}
            color={Colors.textPrimary}
          />
        ) : (
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={26}
            color={Colors.textPrimary}
          />
        )}
      </View>
    </FloatingButton>
  );
};

export default memo(FloatingButtonText);

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  imageContainer: {
    padding: 4,
    borderRadius: 400,
    backgroundColor: "white",
  },
  image: {
    width: 25,
    height: 25,
  },
});
