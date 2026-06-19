import { StyleSheet, ScrollView, Pressable } from "react-native";
import { Colors } from "@/constants/colors";
import ThemedText from "./ThemedText";

import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { GAS_FILTER_OPTIONS } from "@/constants/values";
import { useGasStationStore } from "@/stores/useGasStationsStore";
import { memo } from "react";

function GasOptionsDisplay() {
  const activeGasFilter = useGasStationStore((state) => state.activeGasFilter);
  const setActiveGasFilter = useGasStationStore((state) => state.setActiveGasFilter);

  return (
    <ScrollView
      style={[styles.scrollView]}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      {GAS_FILTER_OPTIONS.map((item) => {
        const isSelected = activeGasFilter === item;
        return (
          <Pressable
            style={({ pressed }) => [
              styles.chip,
              pressed && styles.chipIsBeenPressed,
              isSelected && styles.chipSelected,
            ]}
            key={item}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveGasFilter(item);
              SecureStore.setItemAsync("GasOptionSelected", item);
            }}>
            <ThemedText
              size="m"
              color={Colors.textSecondary}>
              {item}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default memo(GasOptionsDisplay);

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  chip: {
    alignSelf: "center",
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
});
