import React, { memo } from "react";

import { Colors } from "@/constants/colors";
import { PRICE_KEY_TO_FILTER } from "@/constants/values";

import Card from "./layouts/Card";
import MessagePriceDesviation from "./MessagePriceDesviation";
import ThemedText from "./ThemedText";

interface Props {
  type: string;
  price: number;
}

const CardPrice = ({ type, price }: Props) => {
  return (
    <Card>
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
          {price + "€/L"}
        </ThemedText>
      ) : (
        <ThemedText
          size="h2"
          color={Colors.textTertiary}
          weight="bold">
          {" --- €/L"}
        </ThemedText>
      )}
      <MessagePriceDesviation
        type={type}
        price={price}
      />
    </Card>
  );
};

export default memo(CardPrice);
