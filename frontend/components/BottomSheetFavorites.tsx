import { memo, useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackgroundProps, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import ListItemFavorite from "@/components/ListItemFavorite";
import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { GasStation } from "@/types/types";
import { Colors } from "@/constants/colors";

const customBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <LinearGradient
      style={style}
      colors={[Colors.primaryOrange, Colors.primaryPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
};

const favoritesPraceHolder = () => (
  <View style={styles.emptyContainer}>
    <ThemedText
      style={styles.emptyText}
      size="l">
      No hay favoritos
    </ThemedText>
  </View>
);

const renderItem = ({ item }: { item: GasStation }) => <ListItemFavorite gasStation={item} />;

function BottomSheetFavorites() {
  /* VARIABLES */
  const bottomSheetRef = useRef<BottomSheet>(null);
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
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.expand();
    }
  }, [isExpanded]);

  const onBottomSheetChange = useCallback((index: number) => {
    setIsExpanded(index === 1);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      animatedIndex={animatedIndex}
      style={styles.bottomSheet}
      snapPoints={snapPoints}
      index={0}
      onChange={onBottomSheetChange}
      enableDynamicSizing={false}
      enableOverDrag={false}
      handleIndicatorStyle={styles.handlerIndicator}
      backgroundComponent={customBackground}>
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
    </BottomSheet>
  );
}

export default memo(BottomSheetFavorites);

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  handlerIndicator: {
    backgroundColor: "white",
  },
  saveHeader: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  iconContainer: {
    marginStart: "auto",
  },
  list: {
    paddingHorizontal: 24,
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
