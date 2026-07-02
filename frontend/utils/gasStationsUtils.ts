import { GasStation, Margin } from "@/types/types";
import { FILTER_TO_PRICE_KEY } from "@/constants/values";

export function getMarkerGasDisplayInfo(station: GasStation, gasType: string): string {
  const priceKey = FILTER_TO_PRICE_KEY[gasType];
  const price = station.prices?.[priceKey];
  if (price === undefined) {
    return `${gasType}: N/A`;
  }
  return `${gasType}: ${price}€`;
}

export function parseDuration(duration: string): number {
  // Parsear formato como "123s" o "1h23m45s"
  const match = duration.match(/^((\d+)h)?((\d+)m)?((\d+)s)?$/);
  if (!match) return 0;

  let totalSeconds = 0;
  if (match[2]) totalSeconds += parseInt(match[2]) * 3600;
  if (match[4]) totalSeconds += parseInt(match[4]) * 60;
  if (match[6]) totalSeconds += parseInt(match[6]);

  return totalSeconds;
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "Menos de 1 minuto";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${remainingMinutes} min`;
}

export const getPriceColor = (margin: Margin | null | undefined, currentPrice: number | undefined): string => {
  if (!margin || margin.max === margin.min || !currentPrice || currentPrice === 0) {
    return "#8E8E93";
  }

  const { min, max } = margin;

  const boundedPrice = Math.max(min, Math.min(max, currentPrice));

  const percentage = (boundedPrice - min) / (max - min);

  let r = 0;
  let g = 0;
  const b = 0;

  if (percentage < 0.5) {
    const localPercentage = percentage / 0.5;

    r = Math.floor(255 * localPercentage);
    g = 215;
  } else {
    const localPercentage = (1 - percentage) / 0.5;

    r = 255;
    g = Math.floor(215 * localPercentage);
  }

  const toHex = (c: number) => c.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};
