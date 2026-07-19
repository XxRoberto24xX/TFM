import { create } from "zustand";

import { Car } from "@/types/types";

interface CarsState {
  listCars: Car[];
  selectedCar: Car | null;

  setListCars: (listCars: Car[]) => void;
  setSelectedCar: (car: Car | null) => void;
  removeCar: (plate: string) => void;
}

export const useCarStore = create<CarsState>((set) => ({
  listCars: [],
  selectedCar: null,

  setListCars: (listCars) => set({ listCars: listCars }),
  setSelectedCar: (car) => set({ selectedCar: car }),

  removeCar: (plate) =>
    set((state) => ({
      listCars: state.listCars.filter((car) => car.plate !== plate),
    })),
}));
