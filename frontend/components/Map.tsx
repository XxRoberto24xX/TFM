import { ApiError, gasStationWithPrice } from "@/types/types";
import { useFocusEffect } from "expo-router";
import { useHeaderHeight } from "expo-router/build/react-navigation";
import { memo, Ref, useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

import { FILTER_TO_PRICE_KEY, MAX_LATITUDE_DELTA_FOR_MARKERS } from "@/constants/values";
import { getGasStationsInRange } from "@/services/api";
import { useGasStationStore } from "@/stores/useGasStationsStore";
import { useLocationStore } from "@/stores/useLocationStore";
import CustomMarker from "./CustomMarker";

interface Props {
  ref?: Ref<MapView>;
}

function Map({ ref }: Props) {
  /* VARIABLES */
  const headerHeight = useHeaderHeight();
  const [returnedGasStations, setReturnedGasStations] = useState<gasStationWithPrice[]>([]);
  const [mapKey, setMapKey] = useState(0);

  const activeBrandFilter = useGasStationStore((state) => state.activeBrandFilter);
  const activeGasFilter = useGasStationStore((state) => state.activeGasFilter);
  const lastRegion = useLocationStore((state) => state.lastRegion);

  const setSelectedGasStation = useGasStationStore((state) => state.setSelectedGasStation);
  const setLastRegion = useLocationStore((state) => state.setLastRegion);
  const setIsCenteredOnUser = useLocationStore((state) => state.setIsCenteredOnUser);

  /* USEMEMO VARIABLES */
  const paintedGasStations = useMemo(() => {
    if (!returnedGasStations || returnedGasStations.length === 0) {
      return [];
    }

    const filteredStations = returnedGasStations.filter((station) => {
      const matchesBrand =
        activeBrandFilter === "Todos" || station.brand.toUpperCase() === activeBrandFilter.toUpperCase();

      const priceKey = FILTER_TO_PRICE_KEY[activeGasFilter];

      const hasPrice = station.prices && station.prices[priceKey] !== undefined && station.prices[priceKey] > 0;

      return matchesBrand && hasPrice;
    });

    if (filteredStations.length === 0) {
      console.log("No hay ninguna coincidencia");
    }

    return filteredStations;
  }, [returnedGasStations, activeBrandFilter, activeGasFilter]);

  /* HANDLERS */
  const onRegionChanged = async (region: Region) => {
    const north = region.latitude + region.latitudeDelta / 2;
    const south = region.latitude - region.latitudeDelta / 2;
    const east = region.longitude + region.longitudeDelta / 2;
    const west = region.longitude - region.longitudeDelta / 2;

    if (region && region.latitudeDelta < MAX_LATITUDE_DELTA_FOR_MARKERS) {
      try {
        const data = await getGasStationsInRange(north, south, east, west);
        setReturnedGasStations(data.listGasStations);
      } catch (callError) {
        const apiError = callError as ApiError;
        console.log("Get Elements In Region: " + apiError.message);
      }
    } else {
      setReturnedGasStations([]);
    }
  };

  /* ON ACTIVE */
  useFocusEffect(
    useCallback(() => {
      setMapKey((k) => k + 1);
    }, []),
  );

  return (
    <MapView
      style={StyleSheet.absoluteFill}
      key={mapKey}
      ref={ref}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
      onPress={() => setSelectedGasStation(null)}
      onPoiClick={() => {
        setSelectedGasStation(null);
      }}
      onRegionChangeComplete={(region, details) => {
        setLastRegion(region);
        onRegionChanged(region);
        if (details?.isGesture) {
          setIsCenteredOnUser(false);
        }
      }}
      initialRegion={
        lastRegion ?? {
          latitude: 40.4168,
          longitude: -3.7038,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      }>
      {paintedGasStations.map((station) => (
        <CustomMarker
          key={station.id}
          gasStation={station}
        />
      ))}
    </MapView>
  );
}

export default memo(Map);
