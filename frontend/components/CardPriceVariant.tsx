import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/colors";
import { PRICE_KEY_TO_FILTER } from "@/constants/values";

import Card from "./layouts/Card";
import MessagePriceDesviation from "./MessagePriceDesviation";
import ThemedText from "./ThemedText";

interface Props {
  type: string;
  price: number;
}

const CardPriceVariant = ({ type, price }: Props) => {
  return (
    <Card>
      <View style={styles.container}>
        <View>
          <ThemedText
            size="m"
            color={Colors.textTertiary}
            weight="regular">
            {PRICE_KEY_TO_FILTER[type]}
          </ThemedText>
          {price !== 0 ? (
            <ThemedText
              size="h2"
              color={Colors.textTertiary}
              weight="bold">
              {price + " €/L"}
            </ThemedText>
          ) : (
            <ThemedText
              size="h2"
              color={Colors.textTertiary}
              weight="bold">
              {" --- €/L"}
            </ThemedText>
          )}
        </View>
        <View style={styles.message}>
          <MessagePriceDesviation
            type={type}
            price={price}
          />
        </View>
      </View>
    </Card>
  );
};

export default memo(CardPriceVariant);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    marginStart: "auto",
  },
});
