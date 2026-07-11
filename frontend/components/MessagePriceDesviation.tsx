import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { Colors } from "@/constants/colors";

import ThemedText from "./ThemedText";

interface Props {
  type: string;
  price: number;
}

const MessagePriceDesviation = ({ type, price }: Props) => {
  /* VARIABLES */
  const gasMargins = useGasStationStore((state) => state.returnedMargins!);

  /* USEMEMO VARIABLES */
  const deviation = useMemo(() => {
    const fullDeviation = price - (gasMargins[type].min + gasMargins[type].max) / 2;
    return Math.round(fullDeviation * 1000) / 1000;
  }, [gasMargins, type, price]);

  return (
    <View>
      {price !== 0 ? (
        deviation === 0 ? (
          <View style={styles.container}>
            <ThemedText
              size="l"
              color={Colors.textSecondary}
              weight="regular">
              En la media
            </ThemedText>
            <MaterialCommunityIcons
              style={styles.equalIcon}
              name="equal"
              size={20}
              color={Colors.textSecondary}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <ThemedText
              size="l"
              color={deviation < 0 ? "green" : "red"}
              weight="regular">
              {deviation + " €/L"}
            </ThemedText>
            <MaterialCommunityIcons
              name={deviation < 0 ? "triangle-down" : "triangle"}
              size={16}
              color={deviation < 0 ? "green" : "red"}
            />
          </View>
        )
      ) : (
        <View style={styles.container}>
          <ThemedText
            size="l"
            color={Colors.textSecondary}
            weight="regular">
            ---
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default memo(MessagePriceDesviation);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  equalIcon: {
    paddingTop: 4,
  },
});
