import { useGasStationStore } from "@/stores/useGasStationsStore";
import { gasStation } from "@/types/types";
import { memo } from "react";
import { Marker } from "react-native-maps";

interface Props {
  gasStation: gasStation;
}

const CustomMarker = ({ gasStation }: Props) => {
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
};

export default memo(CustomMarker);
