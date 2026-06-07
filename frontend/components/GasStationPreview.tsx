import { Pressable, PressableProps, StyleSheet, ImageSourcePropType, View, Image } from "react-native";
import { Colors } from "@/constants/Colors";

import ThemedText from "./ThemedText";
import { ApiError, gasStation, gasStationWithPrice } from "@/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { addToFavorites, removeFromFavorites } from "@/services/api";
import { useState } from "react";

interface Props extends PressableProps {
  gasStation: gasStationWithPrice;
  priceToShow: string | undefined;
  listFavorites: gasStation[];
  onChangeListFavorites: (filter: gasStation[]) => void;
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

export default function GasStationPreview({
  gasStation,
  priceToShow,
  listFavorites,
  onChangeListFavorites,
  onPress,
  style,
  ...presableProps
}: Props) {
  const imageSource = BRAND_IMAGES[gasStation?.brand] || DEFAULT_IMAGE;
  const isFavorite = listFavorites.some((fav) => fav.id === gasStation.id);
  /* HANDLERS */
  const toggleFavorite = async (id: number) => {
    try {
      if (!isFavorite) {
        await addToFavorites(id);
        onChangeListFavorites([...listFavorites, gasStation]);
      } else {
        await removeFromFavorites(id);
        onChangeListFavorites(listFavorites.filter((fav) => fav.id !== id));
      }
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Toggle Favorite: " + apiError.message);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.previewPressed,
        typeof style === "function" ? style({ pressed }) : style, // <- made to introduce de style only if its a stylesheet
      ]}
      onPress={onPress}
      {...presableProps}>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.primaryOrange, Colors.primaryPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        {gasStation?.id && (
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={imageSource}
            />
          </View>
        )}
        <View style={styles.infoView}>
          <ThemedText size="l">{gasStation.direction}</ThemedText>
          <ThemedText
            style={{ marginTop: 5 }}
            size="s">
            {gasStation.municipality}
          </ThemedText>
          <View style={styles.gasView}>
            {gasStation?.id && <View style={[styles.indicator, { backgroundColor: "green" }]}></View>}
            <ThemedText size="xl">{priceToShow}</ThemedText>
          </View>
        </View>
        <View style={styles.markersView}>
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
            style={{ marginTop: "auto" }}
            name={"chevron-forward"}
            size={30}
            color={Colors.textPrimary}
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 15,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  previewPressed: {
    transform: [{ scale: 0.96 }],

    // Shadow for IOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    // Shadow for Android
    elevation: 2,
  },
  gradient: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    gap: 8,
  },
  infoView: {
    flexDirection: "column",
    flex: 1,
  },
  markersView: {
    flexDirection: "column",
  },
  imageView: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    borderRadius: 10,
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
    width: 50,
    height: 50,
  },
  gasView: {
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    gap: 5,
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 300,
  },
});
