import React, { memo } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { Colors } from "@/constants/colors";

import ThemedText from "./ThemedText";

interface Props {
  option: string;
  imageSource?: ImageSourcePropType;
  onPress: (option: string) => void;
}

const ChipAlternative = ({ option, imageSource, onPress }: Props) => {
  /* VARIABLES */
  const isFilterSelected = useGasStationStore((state) => state.isFilterSelected(option));

  /* HANDLERS */
  const onPressChip = () => {
    onPress(option);
    Haptics.selectionAsync();
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipIsBeenPressed]}
      onPress={onPressChip}>
      {isFilterSelected ? (
        <LinearGradient
          style={styles.gradient}
          colors={[Colors.primaryOrange, Colors.primaryPink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          {imageSource ? (
            <Image
              style={styles.image}
              source={imageSource}
            />
          ) : null}
          <ThemedText
            size="m"
            color={Colors.textPrimary}>
            {option}
          </ThemedText>
        </LinearGradient>
      ) : (
        <View style={styles.chipNotSelected}>
          {imageSource ? (
            <Image
              style={styles.image}
              source={imageSource}
            />
          ) : null}
          <ThemedText
            size="m"
            color={Colors.textTertiary}>
            {option}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
};

export default memo(ChipAlternative);

const styles = StyleSheet.create({
  chip: {
    overflow: "hidden",
    borderRadius: 30,

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
  image: {
    width: 25,
    height: 25,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 5,

    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  chipNotSelected: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 5,

    backgroundColor: "#EAEAEA",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 30,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
});
