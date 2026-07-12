import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import CardPrice from "@/components/CardPrice";
import CardPriceVariant from "@/components/CardPriceVariant";
import ChartFuelPrice from "@/components/ChartFuelPrice";
import FloatingButtonIcon from "@/components/FloatingButtonIcon";
import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { addToFavorites, getHistoricalPrices, removeFromFavorites } from "@/services/api";
import { ApiError, FuelType, Price } from "@/types/types";
import { Colors } from "@/constants/colors";
import { BRAND_IMAGES, DEFAULT_IMAGE } from "@/constants/values";

import { formatDateLabel } from "@/utils/gasStationsUtils";

export default function GasStation() {
  /* VARIABLES */
  const insets = useSafeAreaInsets();

  const gasStation = useGasStationStore.getState().selectedGasStation!;
  const isFavorite = useGasStationStore((state) => state.isFavorite(gasStation.id));

  const imageSource = gasStation ? BRAND_IMAGES[gasStation.brand] || DEFAULT_IMAGE : DEFAULT_IMAGE;

  const [historicalPrices, setHistoricalPrices] = useState<Price[]>([]);
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("diesel");

  /* USEMEMO VARIABLES */
  const chartData = useMemo(() => {
    const sortedPrices = [...historicalPrices].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const validPrices = sortedPrices.filter((p) => p[selectedFuel] > 0);

    const last14Days = validPrices.slice(-14);

    return last14Days.map((item) => ({
      value: item[selectedFuel],
      label: formatDateLabel(item.date),
      dataPointText: `${item[selectedFuel].toFixed(3)} €/L`,
    }));
  }, [historicalPrices, selectedFuel]);

  /* HANDLERS */
  const onBackPress = useCallback(() => {
    router.back();
  }, []);

  const onToggleFavorite = useCallback(async () => {
    const selectedGasStation = useGasStationStore.getState().selectedGasStation;
    const isFavorite = useGasStationStore.getState().isFavorite(selectedGasStation?.id);

    if (selectedGasStation) {
      try {
        if (!isFavorite) {
          await addToFavorites(selectedGasStation.id);
          useGasStationStore.getState().addFavorite(selectedGasStation);
        } else {
          await removeFromFavorites(selectedGasStation.id);
          useGasStationStore.getState().removeFavorite(selectedGasStation.id);
        }
      } catch (callError) {
        const apiError = callError as ApiError;
        console.log("Toggle Favorite: " + apiError.message);
      }
    }
  }, []);

  /* WATCHERS */
  useEffect(() => {
    useGasStationStore.getState().updateSelectedGasStationPrices(historicalPrices[0]);
  }, [historicalPrices]);

  /* ON MOUNT */
  useEffect(() => {
    const getGasStationHistoricalPrices = async () => {
      try {
        const responseHistoricalPrices = await getHistoricalPrices(gasStation.id);
        setHistoricalPrices(responseHistoricalPrices.historicalPrices);
      } catch (error) {
        const apiError = error as ApiError;
        console.log("Gas Station Details: " + apiError.message);
      }
    };

    getGasStationHistoricalPrices();
  }, [gasStation]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contenContainer}>
      <View style={styles.upperContainer}>
        <FloatingButtonIcon
          style={styles.backButton}
          icon="arrow-back"
          onPress={onBackPress}
        />
        <Image
          style={styles.image}
          source={imageSource}
        />
        <FloatingButtonIcon
          style={styles.bookmarkButton}
          icon={isFavorite ? "bookmark" : "bookmark-outline"}
          onPress={onToggleFavorite}
        />
      </View>

      <View>
        <ThemedText
          size="h2"
          color={Colors.textTertiary}
          weight="bold">
          {gasStation.direction}
        </ThemedText>
        <ThemedText
          size="l"
          color={Colors.textTertiary}
          weight="regular">
          {gasStation.municipality}
        </ThemedText>
        <View style={styles.schedule}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={40}
            color={Colors.primaryPink}
          />
          <View>
            <ThemedText
              size="l"
              color={Colors.textTertiary}
              weight="medium">
              Horario de Apertura
            </ThemedText>
            <ThemedText
              size="l"
              color={Colors.textTertiary}
              weight="regular">
              {gasStation.hours}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.pricesContainer}>
        <View style={styles.pricesSubcontainer}>
          <CardPrice
            type="gasoline95"
            price={gasStation.prices?.gasoline95 ?? 0}
          />

          <CardPrice
            type="diesel"
            price={gasStation.prices?.diesel ?? 0}
          />

          <CardPrice
            type="gasoline95Premium"
            price={gasStation.prices?.gasoline95Premium ?? 0}
          />
        </View>
        <View style={styles.pricesSubcontainer}>
          <CardPrice
            type="gasoline98"
            price={gasStation.prices?.gasoline98 ?? 0}
          />

          <CardPrice
            type="dieselRenewable"
            price={gasStation.prices?.dieselRenewable ?? 0}
          />

          <CardPrice
            type="dieselPremium"
            price={gasStation.prices?.dieselPremium ?? 0}
          />
        </View>
      </View>
      <CardPriceVariant
        type="glp"
        price={gasStation.prices?.glp ?? 0}
      />
      <ChartFuelPrice
        style={styles.chart}
        data={chartData}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contenContainer: {
    gap: 16,
  },
  upperContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  backButton: {
    alignSelf: "flex-start",
  },
  bookmarkButton: {
    alignSelf: "flex-start",
    marginLeft: "auto",
  },
  schedule: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 8,
    gap: 8,

    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
  },
  pricesContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  pricesSubcontainer: {
    flex: 1,
    gap: 16,
  },
  image: {
    marginTop: 24,
    marginLeft: "auto",
    width: 70,
    height: 70,
  },
  chart: {
    marginTop: 16,
    marginBottom: 60,
  },
});
