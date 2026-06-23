import React, { memo } from "react";
import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";

import FloatingButton from "./layouts/FloatingButton";

interface Props {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  iconProvider?: "comunity" | "material";
  imageSource?: ImageSourcePropType | null;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const FloatingButtonText = ({ icon, iconProvider = "material", imageSource, style, onPress }: Props) => {
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
            size={32}
            color={Colors.textPrimary}
          />
        ) : (
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={32}
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
    padding: 6,
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
