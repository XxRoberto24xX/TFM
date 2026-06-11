import { Pressable, StyleSheet, View, Image, Animated } from "react-native";
import { Colors } from "@/constants/colors";

import ThemedText from "./ThemedText";
import { ApiError } from "@/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { addToFavorites, removeFromFavorites } from "@/services/api";

import { BRAND_IMAGES, DEFAULT_IMAGE } from "@/constants/values";
import { useEffect, useState } from "react";
import { PressableProps } from "react-native-gesture-handler";
import { useGasStationStore } from "@/stores/useGasStationsStore";
import { useRouter } from "expo-router";
import { getMarkerGasDisplayInfo } from "@/utils/gasStationsUtils";

export default function GasStationPreview({ style }: PressableProps) {
  const router = useRouter();

  const selectedGasStation = useGasStationStore((state) => state.selectedGasStation);
  const listFavorites = useGasStationStore((state) => state.listFavorites);
  const activeGasFilter = useGasStationStore((state) => state.activeGasFilter);

  const addFavorite = useGasStationStore((state) => state.addFavorite);
  const removeFavorite = useGasStationStore((state) => state.removeFavorite);

  const imageSource = selectedGasStation ? BRAND_IMAGES[selectedGasStation.brand] || DEFAULT_IMAGE : DEFAULT_IMAGE;
  const isFavorite = listFavorites.some((fav) => fav.id === selectedGasStation?.id);

  const [slideAnim] = useState(() => new Animated.Value(300));

  /* ANIMATION EFFECTS */
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: selectedGasStation ? 0 : 300,
      duration: selectedGasStation ? 300 : 250,
      useNativeDriver: true,
    }).start();
  }, [selectedGasStation, slideAnim]);

  /* HANDLERS */
  const toggleFavorite = async () => {
    if (selectedGasStation) {
      try {
        if (!isFavorite) {
          await addToFavorites(selectedGasStation.id);
          addFavorite(selectedGasStation);
        } else {
          await removeFromFavorites(selectedGasStation.id);
          removeFavorite(selectedGasStation.id);
        }
      } catch (callError) {
        const apiError = callError as ApiError;
        console.log("Toggle Favorite: " + apiError.message);
      }
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        pointerEvents: selectedGasStation ? "auto" : "none",
      }}>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.previewPressed,
          typeof style === "function" ? style({ pressed }) : style, // <- made to introduce de style only if its a stylesheet
        ]}
        onPress={(e) => {
          e.stopPropagation();
          if (selectedGasStation) {
            router.push({
              pathname: "[id]",
              params: { id: selectedGasStation.id },
            });
          }
        }}>
        <LinearGradient
          style={styles.gradient}
          colors={[Colors.primaryOrange, Colors.primaryPink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          {selectedGasStation?.id && (
            <View style={styles.imageView}>
              <Image
                style={styles.image}
                source={imageSource}
              />
            </View>
          )}
          <View style={styles.infoView}>
            <ThemedText size="l">{selectedGasStation?.direction}</ThemedText>
            <ThemedText
              style={{ marginTop: 5 }}
              size="s">
              {selectedGasStation?.municipality}
            </ThemedText>
            <View style={styles.gasView}>
              {selectedGasStation?.id && <View style={[styles.indicator, { backgroundColor: "green" }]}></View>}
              <ThemedText size="xl">
                {selectedGasStation ? getMarkerGasDisplayInfo(selectedGasStation, activeGasFilter) : ""}
              </ThemedText>
            </View>
          </View>
          <View style={styles.markersView}>
            <Pressable
              onPress={() => {
                toggleFavorite();
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
    </Animated.View>
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
