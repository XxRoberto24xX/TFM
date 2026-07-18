import { memo, useCallback } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { removeFromFavorites } from "@/services/api";
import { ApiError, GasStation } from "@/types/types";
import { Colors } from "@/constants/colors";
import { BRAND_IMAGES, DEFAULT_IMAGE } from "@/constants/values";

import ListItem from "./layouts/ListItem";

interface Props {
  gasStation: GasStation;
  onPress: (place: GasStation) => void;
}

function ListItemFavorite({ gasStation, onPress }: Props) {
  /* VARIABLES */
  const imageSource = BRAND_IMAGES[gasStation.brand] || DEFAULT_IMAGE;

  /* HANDLERS */
  const onRemoveFromFavorites = useCallback(async () => {
    try {
      await removeFromFavorites(gasStation.id);
      useGasStationStore.getState().removeFavorite(gasStation.id);
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Toggle Favorite: " + apiError.message);
    }
  }, [gasStation]);

  const onPressItem = () => {
    onPress(gasStation);
  };

  return (
    <ListItem
      style={styles.container}
      onPress={onPressItem}>
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
      <MaterialIcons
        name={"chevron-right"}
        size={40}
        color={Colors.textPrimary}
      />
    </ListItem>
  );
}

export default memo(ListItemFavorite);

const styles = StyleSheet.create({
  container: {
    padding: 8,
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
