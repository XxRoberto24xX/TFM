import { memo, useCallback } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { router } from "expo-router";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { removeFromFavorites } from "@/services/api";
import { ApiError, GasStation } from "@/types/types";
import { Colors } from "@/constants/colors";
import { BRAND_IMAGES, DEFAULT_IMAGE } from "@/constants/values";

interface Props {
  gasStation: GasStation;
}

function ListItemFavorite({ gasStation }: Props) {
  /* VARIABLES */
  const imageSource = BRAND_IMAGES[gasStation.brand] || DEFAULT_IMAGE;

  /* HANDLERS */
  const onRemoveFromFavorites = async () => {
    try {
      await removeFromFavorites(gasStation.id);
      useGasStationStore.getState().removeFavorite(gasStation.id);
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Toggle Favorite: " + apiError.message);
    }
  };

  const onItemPressed = useCallback(() => {
    router.push({ pathname: "[id]", params: { id: gasStation.direction } });
  }, [gasStation]);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={onItemPressed}>
      <View style={styles.imageView}>
        <Image
          style={styles.image}
          source={imageSource}
        />
      </View>
      <View style={styles.infoView}>
        <ThemedText size="l">{gasStation.direction}</ThemedText>
        <ThemedText
          style={styles.municipalityText}
          size="s">
          {gasStation.municipality}
        </ThemedText>
      </View>
      <Pressable onPress={onRemoveFromFavorites}>
        <MaterialIcons
          name={"bookmark-remove"}
          size={36}
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

export default memo(ListItemFavorite);

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
  municipalityText: {
    marginTop: 6,
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
