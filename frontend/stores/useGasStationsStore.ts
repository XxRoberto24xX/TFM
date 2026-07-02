import { MapType } from "react-native-maps";

import { create } from "zustand";

import { GasStation, Margin } from "@/types/types";
import { FILTER_TO_PRICE_KEY } from "@/constants/values";

interface GasStationState {
  listFavorites: GasStation[] | null;
  activeBrandFilter: string;
  activeGasFilter: string;
  selectedGasStation: GasStation | null;
  mapType: MapType;
  returnedMargins: Record<string, Margin> | null;

  setFavorites: (listFavorites: GasStation[] | null) => void;
  addFavorite: (station: GasStation) => void;
  removeFavorite: (id: number) => void;
  setActiveBrandFilter: (brand: string) => void;
  setActiveGasFilter: (gasType: string) => void;
  setSelectedGasStation: (station: GasStation | null) => void;
  setMapType: (mapType: MapType) => void;
  setReturnedMargins: (margins: Record<string, Margin>) => void;

  isFavorite: (id: number | undefined) => boolean;
  isFilterSelected: (value: string) => boolean;
  getActiveGasMargin: () => Margin | null;
}

export const useGasStationStore = create<GasStationState>((set, get) => ({
  listFavorites: [],
  activeBrandFilter: "Todos",
  activeGasFilter: "E5 95",
  selectedGasStation: null,
  mapType: "standard",
  returnedMargins: null,

  setFavorites: (listFavorites) => set({ listFavorites: listFavorites }),
  addFavorite: (station) =>
    set((state) => {
      const exists = state.listFavorites?.some((fav) => fav.id === station.id);
      if (exists) return {};

      if (state.listFavorites === null) {
        return {
          listFavorites: [station],
        };
      } else {
        return {
          listFavorites: [...state.listFavorites, station],
        };
      }
    }),

  removeFavorite: (id) =>
    set((state) => ({
      listFavorites: state.listFavorites?.filter((fav) => fav.id !== id),
    })),

  setActiveBrandFilter: (brand) => set({ activeBrandFilter: brand }),
  setActiveGasFilter: (gasType) => set({ activeGasFilter: gasType }),
  setSelectedGasStation: (station) => set({ selectedGasStation: station }),
  setMapType: (mapType) => set({ mapType: mapType }),
  setReturnedMargins: (margins) => set({ returnedMargins: margins }),

  isFavorite: (id) => {
    if (!id) return false;
    return get().listFavorites?.some((fav) => fav.id === id) ?? false;
  },

  isFilterSelected: (value) => {
    return value === get().activeBrandFilter || value === get().activeGasFilter;
  },

  getActiveGasMargin: () => {
    const { activeGasFilter, returnedMargins } = get();

    if (!activeGasFilter || !returnedMargins) return null;

    const priceKey = FILTER_TO_PRICE_KEY[activeGasFilter];
    if (priceKey) {
      return returnedMargins[priceKey] ?? null;
    }

    return null;
  },
}));
