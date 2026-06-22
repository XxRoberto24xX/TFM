import { memo } from "react";
import { Image, ImageSourcePropType, Pressable, PressableProps, StyleSheet, View } from "react-native";

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";

interface Props extends PressableProps {
  icon?: keyof typeof Ionicons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  iconProvider?: "ionicons" | "material";
  imageSource?: ImageSourcePropType | null;
}

function IconFloatingButton({
  icon,
  iconProvider = "ionicons",
  imageSource = null,
  style,
  onPress,
  ...pressableProps
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.buttonPressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      onPress={(event) => {
        onPress?.(event);
        Haptics.selectionAsync();
      }}
      {...pressableProps}>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.primaryOrange, Colors.primaryPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
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
      </LinearGradient>
    </Pressable>
  );
}

export default memo(IconFloatingButton);

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
    borderRadius: 30,
    overflow: "hidden",

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],

    // Shadow for IOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    // Shadow for Android
    elevation: 2,
  },
  gradient: {
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
