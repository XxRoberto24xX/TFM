import { useCallback, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetBackgroundProps, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { gasStation } from "@/types/types";

import { Colors } from "@/constants/colors";
import ThemedText from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import FavoriteCard from "./FavoriteCard";
import { useRouter } from "expo-router";

import Animated, { useAnimatedStyle, interpolate, useSharedValue } from "react-native-reanimated";

interface Props {
  listFavorites: gasStation[];
  onChangeListFavorites: (filter: gasStation[]) => void;
}

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

export default function FavoritesBottomSheet({ listFavorites, onChangeListFavorites }: Props) {
  const router = useRouter();
  const snapPoints = useMemo(() => [80], []);

  const [isScrollable, setIsScrollable] = useState(false);
  const maxHeight = Dimensions.get("window").height * 0.5;

  const animatedIndex = useSharedValue(0);

  const iconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animatedIndex.value, [0, 1], [0, 180]);

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const handleContentSize = useCallback(
    (_: any, h: number) => {
      const shouldScroll = h > maxHeight;
      setIsScrollable((prev) => {
        if (prev !== shouldScroll) return shouldScroll;
        return prev;
      });
    },
    [maxHeight],
  );

  return (
    <BottomSheet
      animatedIndex={animatedIndex}
      style={{
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
      }}
      snapPoints={snapPoints}
      index={0}
      enableDynamicSizing={true}
      maxDynamicContentSize={Dimensions.get("window").height * 0.5}
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
        onContentSizeChange={(_, h) => {
          handleContentSize(_, h);
        }}
        scrollEnabled={isScrollable}
        style={{ paddingHorizontal: 24 }}
        data={listFavorites}
        keyExtractor={(item) => item.id.toString()}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          gap: 8,
          paddingBottom: isScrollable ? 0 : 60,
        }}
        renderItem={({ item }) => (
          <FavoriteCard
            gasStation={item}
            listFavorites={listFavorites}
            onChangeListFavorites={onChangeListFavorites}
            onPress={() => {
              router.push({
                pathname: "[id]",
                params: { id: item.id },
              });
            }}
          />
        )}
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
  imageView: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    borderRadius: 10,
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
    width: 50,
    height: 50,
  },
});
