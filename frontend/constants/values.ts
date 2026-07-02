import { Dimensions, ImageSourcePropType } from "react-native";
import { Region } from "react-native-maps";

const FUEL_RELATIONS = [
  ["E5 95", "gasoline95"],
  ["E5 98", "gasoline98"],
  ["Diesel A", "diesel"],
  ["Diesel Premium", "dieselPremium"],
  ["E5 95 Premium", "gasoline95Premium"],
  ["Diesel Renovable", "dieselRenewable"],
  ["GLP", "glp"],
] as const;

export const FILTER_TO_PRICE_KEY = Object.fromEntries(FUEL_RELATIONS);

export const PRICE_KEY_TO_FILTER = Object.fromEntries(FUEL_RELATIONS.map(([filter, key]) => [key, filter]));

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
  "Diesel Premium",
  "E5 95 Premium",
  "Diesel Renovable",
  "GLP",
];

export const BRAND_FILTER_OPTIONS = ["Todos", "Repsol", "Moeve", "Plenergy", "Cepsa", "Shell", "BP", "Galp"];

export const DEFAULT_REGION: Region = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const { width, height } = Dimensions.get("window");

export const LAYOUT = {
  window: {
    width,
    height,
  },
};
