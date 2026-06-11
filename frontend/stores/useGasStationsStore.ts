import { gasStation, gasStationWithPrice } from "@/types/types";
import { create } from "zustand";

interface GasStationState {
  listFavorites: gasStation[];
  activeBrandFilter: string;
  activeGasFilter: string;
  selectedGasStation: gasStationWithPrice | null;

  setFavorites: (listFavorites: gasStation[]) => void;
  addFavorite: (station: gasStation) => void;
  removeFavorite: (id: number) => void;
  setActiveBrandFilter: (brand: string) => void;
  setActiveGasFilter: (gasType: string) => void;
  setSelectedGasStation: (station: gasStationWithPrice | null) => void;
}

export const useGasStationStore = create<GasStationState>((set) => ({
  listFavorites: [],
  activeBrandFilter: "Todos",
  activeGasFilter: "E5 95",
  selectedGasStation: null,

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
}));
