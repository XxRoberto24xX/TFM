import { memo, useCallback } from "react";

import * as SecureStore from "expo-secure-store";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { GAS_FILTER_OPTIONS } from "@/constants/values";

import Chip from "./Chip";
import ChipsFilter from "./layouts/ChipsFilter";

function FilterChipGas() {
  /* HANDLERS */
  const onChipPress = useCallback((option: string) => {
    useGasStationStore.getState().setActiveGasFilter(option);
    SecureStore.setItemAsync("GasOptionSelected", option);
  }, []);

  return (
    <ChipsFilter>
      {GAS_FILTER_OPTIONS.map((option) => (
        <Chip
          key={option}
          option={option}
          onPress={onChipPress}
        />
      ))}
    </ChipsFilter>
  );
}

export default memo(FilterChipGas);
