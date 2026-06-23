import React, { memo } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet } from "react-native";

import * as Haptics from "expo-haptics";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { Colors } from "@/constants/colors";

import ThemedText from "./ThemedText";

interface Props {
  option: string;
  imageSource?: ImageSourcePropType;
  onPress: (option: string) => void;
}

const Chip = ({ option, imageSource, onPress }: Props) => {
  /* VARIABLES */
  const isFilterSelected = useGasStationStore((state) => state.isFilterSelected(option));

  /* HANDLERS */
  const onPressChip = () => {
    onPress(option);
    Haptics.selectionAsync();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        pressed && styles.chipIsBeenPressed,
        isFilterSelected && styles.chipSelected,
      ]}
      onPress={onPressChip}>
      {imageSource ? (
        <Image
          style={styles.image}
          source={imageSource}
        />
      ) : null}
      <ThemedText
        size="m"
        color={Colors.textSecondary}>
        {option}
      </ThemedText>
    </Pressable>
  );
};

export default memo(Chip);

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 5,

    backgroundColor: "white",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 30,

    borderWidth: 2,
    borderColor: "transparent",

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  chipIsBeenPressed: {
    transform: [{ scale: 0.96 }],

    // Shadow for IOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    // Shadow for Android
    elevation: 2,
  },
  chipSelected: {
    borderColor: Colors.primaryPink,
  },
  image: {
    width: 25,
    height: 25,
  },
});
