import { gasStationWithPrice } from "@/types/types";
import { FILTER_TO_PRICE_KEY } from "@/constants/values";

export function getMarkerGasDisplayInfo(station: gasStationWithPrice, gasType: string): string {
  const priceKey = FILTER_TO_PRICE_KEY[gasType];
  const price = station.prices[priceKey];
  return `${gasType}: ${price}€`;
}
