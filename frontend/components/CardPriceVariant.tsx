import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/colors";
import { PRICE_KEY_TO_FILTER } from "@/constants/values";

import MessagePriceDesviation from "./MessagePriceDesviation";
import ThemedText from "./ThemedText";

interface Props {
  type: string;
  price: number;
}

const CardPriceVariant = ({ type, price }: Props) => {
  return (
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
  );
};

export default memo(CardPriceVariant);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  message: {
    marginStart: "auto",
  },
});
