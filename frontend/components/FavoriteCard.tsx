import { Pressable, StyleSheet, Image, View, PressableProps, ImageSourcePropType } from "react-native";
import { Colors } from "@/constants/Colors";
import { ApiError, gasStation } from "@/types/types";

import ThemedText from "./ThemedText";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { addToFavorites, removeFromFavorites } from "@/services/api";
import { blue } from "react-native-reanimated/lib/typescript/Colors";

interface Props extends PressableProps {
  gasStation: gasStation;
  listFavorites: gasStation[];
  onChangeListFavorites: (filter: gasStation[]) => void;
  onPress: () => void;
}

const BRAND_IMAGES: Record<string, ImageSourcePropType> = {
  REPSOL: require("@/assets/brands/repsol.png"),
  CEPSA: require("@/assets/brands/cepsa.png"),
  SHELL: require("@/assets/brands/shell.png"),
  BP: require("@/assets/brands/bp.png"),
  CAMPSA: require("@/assets/brands/campsa.png"),
  GALP: require("@/assets/brands/galp.png"),
  PLANERGY: require("@/assets/brands/plenoil.png"),
};

const DEFAULT_IMAGE = require("@/assets/brands/default.png");

export default function FavoriteCard({
  gasStation,
  listFavorites,
  onChangeListFavorites,
  onPress,
  ...pressableProps
}: Props) {
  const imageSource = BRAND_IMAGES[gasStation?.brand] || DEFAULT_IMAGE;
  const [isFavorite, setIsFavorite] = useState<boolean>(listFavorites.some((fav) => fav.id === gasStation.id));

  /* HANDLERS */
  const toggleFavorite = async (id: number) => {
    try {
      if (!isFavorite) {
        await addToFavorites(id);
        onChangeListFavorites([...listFavorites, gasStation]);
        setIsFavorite(true);
      } else {
        await removeFromFavorites(id);
        onChangeListFavorites(listFavorites.filter((fav) => fav.id !== id));
        setIsFavorite(false);
      }
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Toggle Favorite: " + apiError.message);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={onPress}
      {...pressableProps}>
      <View style={styles.imageView}>
        <Image
          style={styles.image}
          source={imageSource}
        />
      </View>
      <View style={styles.infoView}>
        <ThemedText size="l">{gasStation.direction}</ThemedText>
        <ThemedText
          style={{ marginTop: 6 }}
          size="s">
          {gasStation.municipality}
        </ThemedText>
      </View>
      <Pressable
        onPress={() => {
          toggleFavorite(gasStation.id);
        }}>
        <Ionicons
          name={isFavorite ? "bookmark" : "bookmark-outline"}
          size={30}
          color={Colors.textPrimary}
        />
      </Pressable>
      <Ionicons
        name={"chevron-forward"}
        size={30}
        color={Colors.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 16,
    padding: 8,
    gap: 8,
  },
  containerPressed: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  infoView: {
    flexDirection: "column",
    flex: 1,
  },
  imageView: {
    backgroundColor: Colors.white,
    borderRadius: 16,
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
    width: 48,
    height: 48,
  },
});
