import { useGasStationStore } from "@/stores/useGasStationsStore";
import { gasStationWithPrice } from "@/types/types";
import { memo } from "react";
import { Marker } from "react-native-maps";

interface Props {
  gasStation: gasStationWithPrice;
}

const CustomMarker = ({ gasStation }: Props) => {
  const setSelectedGasStation = useGasStationStore((state) => state.setSelectedGasStation);

  return (
    <Marker
      key={gasStation.id}
      coordinate={{ latitude: gasStation.latitude, longitude: gasStation.longitude }}
      pinColor="red"
      onPress={(e) => {
        e.stopPropagation();
        setSelectedGasStation(gasStation);
      }}
    />
  );
};

export default memo(CustomMarker);
