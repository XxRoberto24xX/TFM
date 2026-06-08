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
  Repsol: require("@/assets/brands/repsol.png"),
  Cepsa: require("@/assets/brands/cepsa.png"),
  Shell: require("@/assets/brands/shell.png"),
  BP: require("@/assets/brands/bp.png"),
  Campsa: require("@/assets/brands/campsa.png"),
  Galp: require("@/assets/brands/galp.png"),
  Plenery: require("@/assets/brands/plenoil.png"),
  Todos: require("@/assets/brands/default.png"),
};

export const DEFAULT_IMAGE = require("@/assets/brands/default.png");
