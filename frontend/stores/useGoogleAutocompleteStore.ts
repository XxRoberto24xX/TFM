import { predicction } from "@/types/types";
import { create } from "zustand";

interface googleAutocompleteState {
  origin: predicction | null;
  destiny: predicction | null;
  listPredictions: predicction[];
  isLoading: boolean;
  sesionToken: string | null;

  setOrigin: (origin: predicction | null) => void;
  setDestiny: (destiny: predicction | null) => void;
  setPredictions: (listPredictions: predicction[]) => void;
  setIsLoading: (value: boolean) => void;
  setSessionToken: (token: string | null) => void;
}

export const useGoogleAutocompleteStore = create<googleAutocompleteState>((set) => ({
  origin: null,
  destiny: null,
  listPredictions: [],
  isLoading: false,
  sesionToken: null,

  setOrigin: (origin) => set({ origin: origin }),
  setDestiny: (destiny) => set({ destiny: destiny }),
  setPredictions: (listPredictions) => set({ listPredictions: listPredictions }),
  setIsLoading: (value) => set({ isLoading: value }),
  setSessionToken: (token) => set({ sesionToken: token }),
}));
