import { memo, useCallback } from "react";

import * as SecureStore from "expo-secure-store";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { BRAND_FILTER_OPTIONS, BRAND_IMAGES } from "@/constants/values";

import Chip from "./Chip";
import ChipsFilter from "./layouts/ChipsFilter";

function ChipsFilterBrands() {
  /* HANDLERS */
  const onChipPress = useCallback((option: string) => {
    useGasStationStore.getState().setActiveBrandFilter(option);
    SecureStore.setItemAsync("BrandOptionSelected", option);
  }, []);

  return (
    <ChipsFilter>
      {BRAND_FILTER_OPTIONS.map((option) => (
        <Chip
          key={option}
          option={option}
          imageSource={BRAND_IMAGES[option.toUpperCase()]}
          onPress={onChipPress}
        />
      ))}
    </ChipsFilter>
  );
}

export default memo(ChipsFilterBrands);
