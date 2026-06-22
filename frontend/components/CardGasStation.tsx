import { memo, useCallback, useEffect, useState } from "react";
import { Animated, GestureResponderEvent, Image, Pressable, StyleSheet, View } from "react-native";
import { PressableProps } from "react-native-gesture-handler";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { addToFavorites, removeFromFavorites } from "@/services/api";
import { ApiError } from "@/types/types";
import { Colors } from "@/constants/colors";
import { BRAND_IMAGES, DEFAULT_IMAGE } from "@/constants/values";

import { getMarkerGasDisplayInfo } from "@/utils/gasStationsUtils";

function CardGasStation({ style }: PressableProps) {
  /* VARIABLES */
  const [slideAnim] = useState(() => new Animated.Value(300));

  const selectedGasStation = useGasStationStore((state) => state.selectedGasStation);
  const activeGasFilter = useGasStationStore((state) => state.activeGasFilter);
  const isFavorite = useGasStationStore((state) => state.isFavorite(selectedGasStation?.id));

  const imageSource = selectedGasStation ? BRAND_IMAGES[selectedGasStation.brand] || DEFAULT_IMAGE : DEFAULT_IMAGE;

  /* ANIMATION EFFECTS */
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: selectedGasStation ? 0 : 300,
      duration: selectedGasStation ? 300 : 250,
      useNativeDriver: true,
    }).start();
  }, [selectedGasStation, slideAnim]);

  /* HANDLERS */
  const onToggleFavorite = useCallback(async () => {
    if (selectedGasStation) {
      try {
        if (!isFavorite) {
          await addToFavorites(selectedGasStation.id);
          useGasStationStore.getState().addFavorite(selectedGasStation);
        } else {
          await removeFromFavorites(selectedGasStation.id);
          useGasStationStore.getState().removeFavorite(selectedGasStation.id);
        }
      } catch (callError) {
        const apiError = callError as ApiError;
        console.log("Toggle Favorite: " + apiError.message);
      }
    }
  }, [isFavorite, selectedGasStation]);

  const onCardClick = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      if (selectedGasStation) {
        router.push({
          pathname: "[id]",
          params: { id: selectedGasStation.id },
        });
      }
    },
    [selectedGasStation],
  );

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
          typeof style === "function" ? style({ pressed }) : style,
        ]}
        onPress={onCardClick}>
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
            <Pressable onPress={onToggleFavorite}>
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

export default memo(CardGasStation);

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
