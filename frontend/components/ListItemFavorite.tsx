import { memo } from "react";
import { Pressable, StyleSheet, Image, View } from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";
import { removeFromFavorites } from "@/services/api";
import { ApiError, gasStation } from "@/types/types";
import { BRAND_IMAGES, DEFAULT_IMAGE } from "@/constants/values";
import { Colors } from "@/constants/colors";

interface Props {
  gasStation: gasStation;
}

function ListItemFavorite({ gasStation }: Props) {
  const removeFavorite = useGasStationStore((state) => state.removeFavorite);
  const imageSource = BRAND_IMAGES[gasStation.brand] || DEFAULT_IMAGE;

  /* HANDLERS */
  const onRemoveFromFavorites = async () => {
    try {
      await removeFromFavorites(gasStation.id);
      removeFavorite(gasStation.id);
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Toggle Favorite: " + apiError.message);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={() => router.push({ pathname: "[id]", params: { id: gasStation.direction } })}>
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
          onRemoveFromFavorites();
        }}>
        <Ionicons
          name={"bookmark"}
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
