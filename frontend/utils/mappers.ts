import { gasStation, gasStationModel, predicction } from "@/types/types";

export const mapGasStationModelToFrontend = (model: gasStationModel): gasStation => {
  return {
    id: model.id,
    hours: model.hours,
    brand: model.brand,
    direction: model.direction,
    sellingType: model.sellingType,
    municipality: model.municipality,
    prices: model.prices,
    coordinates: {
      latitude: model.latitude,
      longitude: model.longitude,
    },
  };
};

export function mapPlaceAutocompleteResponseToFrontend(data: any): predicction[] {
  return (
    data.suggestions?.map((suggestion: any) => {
      const prediction = suggestion.placePrediction;

      return {
        place_id: prediction.placeId,
        description: prediction.text.text,
        structured_formatting: {
          main_text: prediction.structuredFormat.mainText.text,
          secondary_text: prediction.structuredFormat.secondaryText.text,
        },
      };
    }) || []
  );
}
