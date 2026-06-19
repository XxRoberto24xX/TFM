import { StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { Colors } from "@/constants/colors";
import ThemedText from "./ThemedText";
import { BRAND_FILTER_OPTIONS, BRAND_IMAGES } from "@/constants/values";

import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { useGasStationStore } from "@/stores/useGasStationsStore";
import { memo } from "react";

function BrandsOptionsDisplay() {
  const activeBrandFilter = useGasStationStore((state) => state.activeBrandFilter);
  const setActiveBrandFilter = useGasStationStore((state) => state.setActiveBrandFilter);

  return (
    <ScrollView
      style={[styles.scrollView]}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      {BRAND_FILTER_OPTIONS.map((item) => {
        const isSelected = activeBrandFilter === item;
        const imageSource = BRAND_IMAGES[item.toUpperCase()];
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
              setActiveBrandFilter(item);
              SecureStore.setItemAsync("BrandOptionSelected", item);
            }}>
            <Image
              style={styles.image}
              source={imageSource}
            />
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

export default memo(BrandsOptionsDisplay);

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
