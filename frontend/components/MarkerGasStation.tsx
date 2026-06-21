import { memo } from "react";
import { Marker } from "react-native-maps";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { GasStation } from "@/types/types";

interface Props {
  gasStation: GasStation;
}

function MarkerGasStation({ gasStation }: Props) {
  return (
    <Marker
      coordinate={gasStation.coordinates}
      pinColor="red"
      tracksViewChanges={false}
      onPress={(e) => {
        e.stopPropagation();
        useGasStationStore.getState().setSelectedGasStation(gasStation);
      }}
    />
  );
}

const areEqual = (prevProps: any, nextProps: any) => {
  return (
    prevProps.gasStation.id === nextProps.gasStation.id &&
    JSON.stringify(prevProps.gasStation.prices) === JSON.stringify(nextProps.gasStation.prices)
  );
};

export default memo(MarkerGasStation, areEqual);
