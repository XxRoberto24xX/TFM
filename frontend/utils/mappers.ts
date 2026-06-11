import { gasStation, gasStationModel } from "@/types/types";

export const mapGasStationModelToFrontend = (model: gasStationModel): gasStation => {
  return {
    id: model.id,
    hours: model.hours,
    brand: model.brand,
    direction: model.direction,
    sellingType: model.sellingType,
    municipality: model.municipality,
    prices: model.prices,
    // 🌟 Aquí ocurre la magia que querías para agrupar las coordenadas:
    coordinates: {
      latitude: model.latitude,
      longitude: model.longitude,
    },
  };
};
