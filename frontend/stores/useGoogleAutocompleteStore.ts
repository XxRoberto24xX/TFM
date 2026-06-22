import { create } from "zustand";

import { AutocompleteType, Predicction } from "@/types/types";

interface googleAutocompleteState {
  origin: Predicction | null;
  destiny: Predicction | null;
  originQuery: string;
  destinyQuery: string;
  listPredictions: Predicction[];
  isLoading: boolean;
  sesionToken: string | null;
  displayBottomSheet: boolean;
  activeInput: AutocompleteType | null;

  setOrigin: (origin: Predicction | null) => void;
  setDestiny: (destiny: Predicction | null) => void;
  setPredictions: (listPredictions: Predicction[]) => void;
  setIsLoading: (value: boolean) => void;
  setSessionToken: (token: string | null) => void;
  setDisplayBottomSheet: (value: boolean) => void;
  setQuery: (type: AutocompleteType, value: string) => void;
  handleCancelSearch: () => void;
  setActiveInput: (type: AutocompleteType | null) => void;

  resetStore: () => void;
}

const initialValues = {
  origin: null,
  destiny: null,
  originQuery: "",
  destinyQuery: "",
  listPredictions: [],
  isLoading: false,
  sesionToken: null,
  displayBottomSheet: false,
  activeInput: null,
};

export const useGoogleAutocompleteStore = create<googleAutocompleteState>((set) => ({
  ...initialValues,

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

  resetStore: () => set(initialValues),
}));
