import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Image, View, PressableProps, ImageSourcePropType } from "react-native";
import { Colors } from "@/constants/Colors";
import { gasStation } from "@/types/types";

import * as Haptics from "expo-haptics";

import ThemedText from "./ThemedText";

interface Props extends PressableProps {
  gasStation: gasStation;
  onPress: () => void;
}

const BRAND_IMAGES: Record<string, ImageSourcePropType> = {
  REPSOL: require("@/assets/brands/repsol.png"),
  CEPSA: require("@/assets/brands/cepsa.png"),
  SHELL: require("@/assets/brands/shell.png"),
};

const DEFAULT_IMAGE = require("@/assets/brands/default.png");

export default function FavoriteCard({ gasStation, onPress, ...pressableProps }: Props) {
  const imageSource = BRAND_IMAGES[gasStation.brand] || DEFAULT_IMAGE;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      {...pressableProps}>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.primaryOrange, Colors.primaryPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <ThemedText
          size="l"
          style={{ flex: 1, textAlign: "center", textAlignVertical: "center" }}>
          {gasStation.direction}
        </ThemedText>
        <ThemedText
          size="s"
          style={{ textAlign: "center", marginBottom: 10 }}>
          {gasStation.municipality}
        </ThemedText>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={imageSource}
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    width: 120,
    height: 170,
    overflow: "hidden",

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  containerPressed: {
    transform: [{ scale: 0.96 }],

    // Shadow for IOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    // Shadow for Android
    elevation: 2,
  },
  gradient: {
    flex: 1,
    padding: 10,
  },
  imageView: {
    alignSelf: "center",
    backgroundColor: Colors.white,
    borderRadius: 100,
    padding: 3,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  image: {
    width: 45,
    height: 45,
  },
});
