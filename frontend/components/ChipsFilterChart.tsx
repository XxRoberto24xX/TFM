import { memo, useCallback } from "react";

import * as SecureStore from "expo-secure-store";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import ChipAlternative from "./ChipAlternative";
import ChipsFilter from "./layouts/ChipsFilter";

interface Props {
  availableFuelLabels: string[];
}

function ChipsFilterChart({ availableFuelLabels }: Props) {
  /* HANDLERS */
  const onChipPress = useCallback((option: string) => {
    useGasStationStore.getState().setActiveGasFilter(option);
    SecureStore.setItemAsync("GasOptionSelected", option);
  }, []);

  return (
    <ChipsFilter>
      {availableFuelLabels.map((option) => (
        <ChipAlternative
          key={option}
          option={option}
          onPress={onChipPress}
        />
      ))}
    </ChipsFilter>
  );
}

export default memo(ChipsFilterChart);
