import { Region } from "react-native-maps";
import { create } from "zustand";

import * as Location from "expo-location";

interface LocationState {
  lastRegion: Region | null;
  userLocation: Location.LocationObject | null;
  isCenteredOnUser: boolean;

  setLastRegion: (region: Region) => void;
  setUserLocation: (location: Location.LocationObject) => void;
  setIsCenteredOnUser: (value: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lastRegion: null,
  userLocation: null,
  isCenteredOnUser: false,

  setLastRegion: (region) => set({ lastRegion: region }),
  setUserLocation: (location) => set({ userLocation: location }),
  setIsCenteredOnUser: (value) => set({ isCenteredOnUser: value }),
}));
