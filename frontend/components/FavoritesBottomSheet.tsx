import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetBackgroundProps, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { Colors } from "@/constants/colors";
import ThemedText from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import FavoriteCard from "./FavoriteCard";
import { useRouter } from "expo-router";

import Animated, { useAnimatedStyle, interpolate, useSharedValue } from "react-native-reanimated";
import { useGasStationStore } from "@/stores/useGasStationsStore";

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

export default function FavoritesBottomSheet() {
  const router = useRouter();
  const snapPoints = useMemo(() => [80, Dimensions.get("window").height * 0.4], []);
  const animatedIndex = useSharedValue(0);

  const listFavorites = useGasStationStore((state) => state.listFavorites);

  const iconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animatedIndex.value, [0, 1], [0, 180], "clamp");
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <BottomSheet
      animatedIndex={animatedIndex}
      style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden" }}
      snapPoints={snapPoints}
      index={0}
      enableDynamicSizing={false}
      enableOverDrag={false}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      backgroundComponent={CustomBackground}>
      <View style={styles.saveHeader}>
        <ThemedText size="h2">Guardados</ThemedText>
        <Animated.View style={[{ marginStart: "auto" }, iconStyle]}>
          <Ionicons
            name="chevron-up"
            size={30}
            color={Colors.textPrimary}
          />
        </Animated.View>
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
