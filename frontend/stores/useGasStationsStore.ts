import { MapType } from "react-native-maps";

import { create } from "zustand";

import { GasStation } from "@/types/types";

interface GasStationState {
  listFavorites: GasStation[];
  activeBrandFilter: string;
  activeGasFilter: string;
  selectedGasStation: GasStation | null;
  mapType: MapType;

  setFavorites: (listFavorites: GasStation[]) => void;
  addFavorite: (station: GasStation) => void;
  removeFavorite: (id: number) => void;
  setActiveBrandFilter: (brand: string) => void;
  setActiveGasFilter: (gasType: string) => void;
  setSelectedGasStation: (station: GasStation | null) => void;
  setMapType: (mapType: MapType) => void;

  isFavorite: (id: number | undefined) => boolean;
  isBrandFilterSelected: (value: string) => boolean;
  isGasFilterSelected: (value: string) => boolean;
}

export const useGasStationStore = create<GasStationState>((set, get) => ({
  listFavorites: [],
  activeBrandFilter: "Todos",
  activeGasFilter: "E5 95",
  selectedGasStation: null,
  mapType: "standard",

  setFavorites: (listFavorites) => set({ listFavorites: listFavorites }),
  addFavorite: (station) =>
    set((state) => {
      const exists = state.listFavorites.some((fav) => fav.id === station.id);
      if (exists) return {};

      return {
        listFavorites: [...state.listFavorites, station],
      };
    }),

  removeFavorite: (id) =>
    set((state) => ({
      listFavorites: state.listFavorites.filter((fav) => fav.id !== id),
    })),

  setActiveBrandFilter: (brand) => set({ activeBrandFilter: brand }),
  setActiveGasFilter: (gasType) => set({ activeGasFilter: gasType }),
  setSelectedGasStation: (station) => set({ selectedGasStation: station }),
  setMapType: (mapType) => set({ mapType: mapType }),

  isFavorite: (id) => {
    if (!id) return false;
    return get().listFavorites.some((fav) => fav.id === id);
  },

  isBrandFilterSelected: (value) => {
    return value === get().activeBrandFilter;
  },

  isGasFilterSelected: (value) => {
    return value === get().activeGasFilter;
  },
}));
