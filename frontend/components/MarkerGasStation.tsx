import { memo } from "react";
import { Marker, MarkerPressEvent } from "react-native-maps";

import { GasStation } from "@/types/types";

interface Props {
  gasStation: GasStation;
  onPress: (gasStation: GasStation) => void;
}

function MarkerGasStation({ gasStation, onPress }: Props) {
  /* HANDLERS */
  const onPressMarker = (event: MarkerPressEvent) => {
    event.stopPropagation();
    onPress(gasStation);
  };

  return (
    <Marker
      coordinate={gasStation.coordinates}
      pinColor="red"
      tracksViewChanges={false}
      onPress={onPressMarker}
    />
  );
}

const areEqual = (prevProps: { gasStation: GasStation }, nextProps: { gasStation: GasStation }) => {
  return (
    prevProps.gasStation.id === nextProps.gasStation.id &&
    JSON.stringify(prevProps.gasStation.prices) === JSON.stringify(nextProps.gasStation.prices)
  );
};

export default memo(MarkerGasStation, areEqual);
