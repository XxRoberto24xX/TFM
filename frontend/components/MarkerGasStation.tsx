import { memo } from "react";
import { Marker, MarkerPressEvent } from "react-native-maps";

import { GasStation } from "@/types/types";

interface Props {
  gasStation: GasStation;
  color: string;
  onPress: (gasStation: GasStation) => void;
}

function MarkerGasStation({ gasStation, color, onPress }: Props) {
  /* HANDLERS */
  const onPressMarker = (event: MarkerPressEvent) => {
    event.stopPropagation();
    onPress(gasStation);
  };

  return (
    <Marker
      coordinate={gasStation.coordinates}
      pinColor={color}
      tracksViewChanges={false}
      onPress={onPressMarker}
    />
  );
}

const areEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.color === nextProps.color &&
    prevProps.gasStation.id === nextProps.gasStation.id &&
    JSON.stringify(prevProps.gasStation.prices) === JSON.stringify(nextProps.gasStation.prices)
  );
};

export default memo(MarkerGasStation, areEqual);
