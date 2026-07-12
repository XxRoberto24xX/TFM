import React, { memo, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { FuelType, Price } from "@/types/types";
import { Colors } from "@/constants/colors";
import { FILTER_TO_PRICE_KEY, PRICE_KEY_TO_FILTER } from "@/constants/values";

import ChipsFilterChart from "./ChipsFilterChart";

import { formatDateLabel } from "@/utils/gasStationsUtils";

interface Props {
  style?: StyleProp<ViewStyle>;
  historicalPrices: Price[];
}

const ALL_FUEL_KEYS: FuelType[] = [
  "gasoline95",
  "gasoline98",
  "diesel",
  "dieselPremium",
  "gasoline95Premium",
  "dieselRenewable",
  "glp",
];

const ChartFuelPrice = ({ style, historicalPrices }: Props) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const selectedFuel = useGasStationStore((state) => state.activeGasFilter);

  /* USEMEMO VARIABLES */
  const chartData = useMemo(() => {
    const sortedPrices = [...historicalPrices].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const validPrices = sortedPrices.filter((p) => p[FILTER_TO_PRICE_KEY[selectedFuel] as FuelType] > 0);

    const last14Days = validPrices.slice(-14);

    return last14Days.map((item) => ({
      value: item[FILTER_TO_PRICE_KEY[selectedFuel] as FuelType],
      label: formatDateLabel(item.date),
      dataPointText: `${item[FILTER_TO_PRICE_KEY[selectedFuel] as FuelType].toFixed(3)} €/L`,
    }));
  }, [historicalPrices, selectedFuel]);

  const availableFuels = useMemo<FuelType[]>(() => {
    if (!historicalPrices || historicalPrices.length === 0) return [];

    return ALL_FUEL_KEYS.filter((fuelKey) => {
      return historicalPrices.some((priceObj) => priceObj[fuelKey] > 0);
    });
  }, [historicalPrices]);

  const availableFuelLabels = useMemo(() => {
    return availableFuels.map((fuel) => PRICE_KEY_TO_FILTER[fuel]);
  }, [availableFuels]);

  const values = chartData.map((d) => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);

  const STEP = 0.05;

  const yAxisMin = Math.floor(minVal / STEP) * STEP - 0.05;

  let yAxisMax = Math.ceil(maxVal / STEP) * STEP + 0.05;
  if (yAxisMax === yAxisMin) {
    yAxisMax += STEP;
  }

  const calculatedSections = Math.round((yAxisMax - yAxisMin) / STEP);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - 72);
  };

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}>
      <Text style={styles.title}>Evolución Últimos 14 Días</Text>

      <ChipsFilterChart availableFuelLabels={availableFuelLabels} />

      <View style={styles.chartWrapper}>
        {chartData.length !== 0 ? (
          <LineChart
            areaChart
            data={chartData}
            width={containerWidth}
            height={200}
            spacing={50}
            initialSpacing={20}
            endSpacing={15}

            yAxisOffset={yAxisMin}
            stepValue={STEP}
            noOfSections={calculatedSections}

            yAxisLabelWidth={30}
            roundToDigits={3}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}

            textColor={Colors.black}
            textShiftY={-10}
            textShiftX={-10}

            thickness={4}
            color={Colors.primaryPink}

            startFillColor={Colors.primaryPink}
            endFillColor={Colors.primaryOrange}
            startOpacity={0.5}
            endOpacity={0.5}

            dataPointsColor={Colors.primaryPink}
            dataPointsRadius={5}
            focusedDataPointColor={Colors.primaryOrange}
            focusedDataPointRadius={7}

            rulesColor="#EAEAEA"
            rulesType="solid"
            showVerticalLines
            verticalLinesColor="#EAEAEA"

            hideRules={false}
            yAxisColor="transparent"
            xAxisColor="#EAEAEA"
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay datos históricos disponibles para este combustible</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(ChartFuelPrice);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,

    borderRadius: 16,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },
  axisText: {
    color: Colors.black,
    fontSize: 10,
  },
  emptyContainer: {
    height: 233,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 14,
  },
});
