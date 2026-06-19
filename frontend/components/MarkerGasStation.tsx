import { memo } from "react";
import { Marker } from "react-native-maps";

import { useGasStationStore } from "@/stores/useGasStationsStore";
import { gasStation } from "@/types/types";

interface Props {
  gasStation: gasStation;
}

function MarkerGasStation({ gasStation }: Props) {
  const setSelectedGasStation = useGasStationStore((state) => state.setSelectedGasStation);

  return (
    <Marker
      coordinate={gasStation.coordinates}
      pinColor="red"
      tracksViewChanges={false}
      onPress={(e) => {
        e.stopPropagation();
        setSelectedGasStation(gasStation);
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
