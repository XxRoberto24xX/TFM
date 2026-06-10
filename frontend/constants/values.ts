import { price } from "@/types/types";
import { ImageSourcePropType } from "react-native";

export const FILTER_TO_PRICE_KEY: Record<string, keyof Omit<price, "date">> = {
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
  CAMPSA: require("@/assets/brands/campsa.png"),
  GALP: require("@/assets/brands/galp.png"),
  PLENERY: require("@/assets/brands/plenoil.png"),
};

export const DEFAULT_IMAGE = require("@/assets/brands/default.png");

export const MAX_LATITUDE_DELTA_FOR_MARKERS = 1;
