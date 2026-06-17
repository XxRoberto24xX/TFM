import { AutocompleteType, predicction } from "@/types/types";
import { create } from "zustand";

interface googleAutocompleteState {
  origin: predicction | null;
  destiny: predicction | null;
  originQuery: string;
  destinyQuery: string;
  listPredictions: predicction[];
  isLoading: boolean;
  sesionToken: string | null;
  displayBottomSheet: boolean;
  activeInput: AutocompleteType | null;

  setOrigin: (origin: predicction | null) => void;
  setDestiny: (destiny: predicction | null) => void;
  setPredictions: (listPredictions: predicction[]) => void;
  setIsLoading: (value: boolean) => void;
  setSessionToken: (token: string | null) => void;
  setDisplayBottomSheet: (value: boolean) => void;
  setQuery: (type: AutocompleteType, value: string) => void;
  handleCancelSearch: () => void;
  setActiveInput: (type: AutocompleteType | null) => void;
}

export const useGoogleAutocompleteStore = create<googleAutocompleteState>((set) => ({
  origin: null,
  destiny: null,
  originQuery: "",
  destinyQuery: "",
  listPredictions: [],
  isLoading: false,
  sesionToken: null,
  displayBottomSheet: false,
  activeInput: null,

  setOrigin: (origin) => set({ origin }),
  setDestiny: (destiny) => set({ destiny }),
  setPredictions: (listPredictions) => set({ listPredictions }),
  setIsLoading: (value) => set({ isLoading: value }),
  setSessionToken: (token) => set({ sesionToken: token }),
  setDisplayBottomSheet: (value) => set({ displayBottomSheet: value }),
  setQuery: (type, value) =>
    set((state) => ({
      ...state,
      [type === "origin" ? "originQuery" : "destinyQuery"]: value,
    })),
  handleCancelSearch: () =>
    set((state) => {
      const type = state.activeInput;
      if (!type) return {};

      const currentQuery = type === "origin" ? state.originQuery : state.destinyQuery;

      if (currentQuery.trim() === "") {
        return {
          [type]: null, // Resetea 'origin' o 'destiny' a null dinámicamente
          [type === "origin" ? "originQuery" : "destinyQuery"]: "",
        };
      }

      const previousPlace = type === "origin" ? state.origin : state.destiny;
      return {
        [type === "origin" ? "originQuery" : "destinyQuery"]: previousPlace
          ? previousPlace.structured_formatting.main_text
          : "",
      };
    }),
  setActiveInput: (type) => set({ activeInput: type }),
}));
