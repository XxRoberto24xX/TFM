import { ImageSourcePropType } from "react-native";
import { Region } from "react-native-maps";

import { Price } from "@/types/types";

export const FILTER_TO_PRICE_KEY: Record<string, keyof Omit<Price, "date">> = {
  "E5 95": "gasoline95",
  "E5 98": "gasoline98",
  "Diesel A": "diesel",
  "Diesel B": "diesel",
  "Diesel +": "diesel",
  "Gas Natural": "diesel",
  Biocombustible: "diesel",
};

export const BRAND_IMAGES: Record<string, ImageSourcePropType> = {
  TODOS: require("@/assets/brands/default.png"),
  REPSOL: require("@/assets/brands/repsol.png"),
  CEPSA: require("@/assets/brands/cepsa.png"),
  SHELL: require("@/assets/brands/shell.png"),
  BP: require("@/assets/brands/bp.png"),
  GALP: require("@/assets/brands/galp.png"),
  PLENERGY: require("@/assets/brands/plenoil.png"),
  MOEVE: require("@/assets/brands/moeve.png"),
};

export const DEFAULT_IMAGE = require("@/assets/brands/default.png");

export const MAX_LATITUDE_DELTA_FOR_MARKERS = 1;

export const GAS_FILTER_OPTIONS = [
  "E5 95",
  "E5 98",
  "Diesel A",
  "Diesel B",
  "Diesel +",
  "Gas Natural",
  "Biocombustible",
];

export const BRAND_FILTER_OPTIONS = ["Todos", "Repsol", "Moeve", "Plenergy", "Cepsa", "Shell", "BP", "Galp"];

export const DEFAULT_REGION: Region = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
