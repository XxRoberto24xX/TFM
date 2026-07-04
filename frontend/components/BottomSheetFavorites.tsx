import { memo, RefObject, useCallback, useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import ListItemFavorite from "@/components/ListItemFavorite";
import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { GasStation } from "@/types/types";
import { Colors } from "@/constants/colors";

import BottomSheetThemed from "./layouts/BottomSheetThemed";

const favoritesPraceHolder = () => (
  <View style={styles.emptyContainer}>
    <ThemedText
      style={styles.emptyText}
      size="l">
      No hay favoritos
    </ThemedText>
  </View>
);

interface Props {
  bottomSheetRef: RefObject<BottomSheet | null>;
}

function BottomSheetFavorites({ bottomSheetRef }: Props) {
  /* VARIABLES */
  const animatedIndex = useSharedValue(0);

  const [isExpanded, setIsExpanded] = useState(false);

  const listFavorites = useGasStationStore((state) => state.listFavorites);

  /* ANIMATED STYLES */
  const iconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animatedIndex.value, [0, 1], [0, 180], "clamp");
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  /* USEMEMO */
  const snapPoints = useMemo(() => [80, Dimensions.get("window").height * 0.4], []);

  /* HANDELERS */
  const onToggleBottomSheet = useCallback(() => {
    if (isExpanded) {
      bottomSheetRef?.current?.snapToIndex(0);
    } else {
      bottomSheetRef?.current?.expand();
    }
  }, [isExpanded, bottomSheetRef]);

  const onBottomSheetChange = useCallback((index: number) => {
    setIsExpanded(index === 1);
  }, []);

  const onFavoriteSelect = useCallback(
    (gasStation: GasStation) => {
      useGasStationStore.getState().setSelectedGasStation(gasStation);
      bottomSheetRef?.current?.snapToIndex(0);
    },
    [bottomSheetRef],
  );

  /* ITEMS */
  const renderItem = useCallback(
    ({ item }: { item: GasStation }) => (
      <ListItemFavorite
        gasStation={item}
        onPress={onFavoriteSelect}
      />
    ),
    [onFavoriteSelect],
  );

  return (
    <BottomSheetThemed
      ref={bottomSheetRef}
      animatedIndex={animatedIndex}
      index={0}
      snapPoints={snapPoints}
      onChange={onBottomSheetChange}>
      <View style={styles.saveHeader}>
        <ThemedText size="h2">Guardados</ThemedText>
        <Pressable
          style={styles.iconContainer}
          onPress={onToggleBottomSheet}>
          <Animated.View style={iconStyle}>
            <Ionicons
              name="chevron-up"
              size={30}
              color={Colors.textPrimary}
            />
          </Animated.View>
        </Pressable>
      </View>

      <BottomSheetFlatList
        style={styles.list}
        data={listFavorites}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={favoritesPraceHolder}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
      />
    </BottomSheetThemed>
  );
}

export default memo(BottomSheetFavorites);

const styles = StyleSheet.create({
  saveHeader: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  iconContainer: {
    marginStart: "auto",
  },
  list: {
    paddingHorizontal: 8,
  },
  listContainer: {
    gap: 8,
    paddingBottom: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
});
