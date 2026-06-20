import { memo, useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, interpolate, useSharedValue } from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import BottomSheet, { BottomSheetBackgroundProps, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import FavoriteCard from "@/components/ListItemFavorite";
import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";
import { Colors } from "@/constants/colors";

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
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

function BottomSheetFavorites() {
  /* VARIABLES */
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedIndex = useSharedValue(0);

  const [isExpanded, setIsExpanded] = useState(false);

  const listFavorites = useGasStationStore((state) => state.listFavorites);

  const iconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animatedIndex.value, [0, 1], [0, 180], "clamp");
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  /* USEMEMO */
  const snapPoints = useMemo(() => [80, Dimensions.get("window").height * 0.4], []);

  /* HANDELERS */
  const handelToggleBottomSheet = useCallback(() => {
    if (isExpanded) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.expand();
    }
  }, [isExpanded]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      animatedIndex={animatedIndex}
      style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden" }}
      snapPoints={snapPoints}
      index={0}
      onChange={(index) => {
        setIsExpanded(index === 1);
      }}
      enableDynamicSizing={false}
      enableOverDrag={false}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      backgroundComponent={CustomBackground}>
      <View style={styles.saveHeader}>
        <ThemedText size="h2">Guardados</ThemedText>
        <Pressable
          style={{ marginStart: "auto" }}
          onPress={handelToggleBottomSheet}>
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
        style={{ paddingHorizontal: 24 }}
        data={listFavorites}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={favoritesPraceHolder}
        contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
        renderItem={({ item }) => <FavoriteCard gasStation={item} />}
      />
    </BottomSheet>
  );
}

export default memo(BottomSheetFavorites);

const styles = StyleSheet.create({
  saveHeader: {
    flexDirection: "row",
    alignContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
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
