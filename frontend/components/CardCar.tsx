import React, { memo, useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";

import { Car } from "@/types/types";
import { Colors } from "@/constants/colors";
import { CAR_BRANDS_IAMGES, DEFAULT_IMAGE } from "@/constants/values";

import Card from "./layouts/Card";
import ThemedText from "./ThemedText";

interface Props {
  car: Car;
}

function CardCar({ car }: Props) {
  /* USEMEMO VARIBALES */
  const imageSource = useMemo(() => {
    return CAR_BRANDS_IAMGES[car.brand.toUpperCase()] || DEFAULT_IMAGE;
  }, [car]);

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.imageContiner}>
          <Image
            style={styles.image}
            source={imageSource}
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText
            size="h2"
            color={Colors.textTertiary}>
            {`${car.brand} ${car.model}`}
          </ThemedText>
          <ThemedText
            size="l"
            weight="medium"
            color={Colors.textTertiary}>
            {car.plate}
          </ThemedText>
          <ThemedText
            weight="regular"
            style={styles.consumptionText}
            size="l"
            color={Colors.textTertiary}>
            {`Consumo: ${car.consumption} €/100Km`}
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

export default memo(CardCar);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
    gap: 16,
  },
  imageContiner: {
    alignSelf: "flex-start",
    borderRadius: 100,
    backgroundColor: "#d8d8d8",
    padding: 8,
  },
  image: {
    width: 40,
    height: 40,
  },
  textContainer: {},
  consumptionText: {
    marginTop: 8,
  },
});
