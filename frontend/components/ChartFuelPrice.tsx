import React, { memo, useState } from "react";
import { LayoutChangeEvent, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { Colors } from "@/constants/colors";

interface Props {
  style?: StyleProp<ViewStyle>;
  data: { value: number; label: string }[];
}

const ChartFuelPrice = ({ style, data }: Props) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay datos históricos disponibles</Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);

  const yAxisMin = Math.floor(minVal * 10) / 10;

  let yAxisMax = Math.ceil(maxVal * 10) / 10;
  if (yAxisMax === yAxisMin) {
    yAxisMax += 0.1;
  }

  const STEP = 0.05;
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

      <View style={styles.chartWrapper}>
        <LineChart
          areaChart
          data={data}
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
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 14,
  },
});
