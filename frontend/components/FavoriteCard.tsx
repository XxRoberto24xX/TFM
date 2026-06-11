import { Pressable, StyleSheet, Image, View } from "react-native";
import { Colors } from "@/constants/colors";
import { ApiError, gasStation } from "@/types/types";

import ThemedText from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { removeFromFavorites } from "@/services/api";

import { BRAND_IMAGES, DEFAULT_IMAGE } from "@/constants/values";
import { router } from "expo-router";
import { useGasStationStore } from "@/stores/useGasStationsStore";

interface Props {
  gasStation: gasStation;
}

export default function FavoriteCard({ gasStation }: Props) {
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
