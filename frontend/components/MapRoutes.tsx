import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { LongPressEvent, Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { useFocusEffect } from "expo-router";

import BottomSheet from "@gorhom/bottom-sheet";

import { useGasStationStore } from "@/stores/useGasStationsStore";
import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";
import { useLocationStore } from "@/stores/useLocationStore";

import { computeRoute, getGasStationsInRoute } from "@/services/api";
import { GasStation, RouteResponse } from "@/types/types";
import { DEFAULT_REGION, FILTER_TO_PRICE_KEY } from "@/constants/values";

import MarkerGasStation from "./MarkerGasStation";

import { getPriceColor } from "@/utils/gasStationsUtils";

interface Props {
  bottomSheetRef: RefObject<BottomSheet | null>;
}

function MapRoutes({ bottomSheetRef }: Props) {
  /* VARIABLES */
  const mapRef = useRef<MapView>(null);

  const [mapKey, setMapKey] = useState(0);
  const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
  const [returnedGasStations, setReturnedGasStations] = useState<GasStation[]>([]);

  const initialRegion = useLocationStore.getState().lastRegion || DEFAULT_REGION;
  const origin = useGoogleAutocompleteStore((state) => state.origin);
  const destiny = useGoogleAutocompleteStore((state) => state.destiny);

  const activeGasFilter = useGasStationStore((state) => state.activeGasFilter);
  const activeBrandFilter = useGasStationStore((state) => state.activeBrandFilter);
  const activeGasMargin = useGasStationStore((state) => state.getActiveGasMargin());

  /* USE MEMO VARIABLES */
  //need to bypasses a rendering bug with the maps library when painting the route
  const safeCoordinates = useMemo(() => {
    return routeResult?.coordinates ? [...routeResult.coordinates] : [];
  }, [routeResult]);

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

  /* WATCHERS */
  useEffect(() => {
    const animationAndRouting = async () => {
      const map = mapRef?.current;
      if (!map) return;

      setRouteResult(null);
      setReturnedGasStations([]);

      const originCoords = origin?.coordinates;
      const destinyCoords = destiny?.coordinates;

      if (originCoords && destinyCoords) {
        try {
          const resultantRoute = await computeRoute(originCoords, destinyCoords);
          const data = await getGasStationsInRoute(resultantRoute.coordinates, 5000);
          setRouteResult(resultantRoute);
          setReturnedGasStations(data.listGasStations);
          useGasStationStore.getState().setReturnedMargins(data.priceMargins);
        } catch (error) {
          console.error("Error calculando la ruta:", error);
        }

        map.fitToCoordinates([originCoords, destinyCoords], {
          edgePadding: { top: 250, right: 100, bottom: 100, left: 100 },
          animated: true,
        });
      } else if (originCoords) {
        map.animateToRegion(
          {
            latitude: originCoords.latitude,
            longitude: originCoords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          1000,
        );
      } else if (destinyCoords) {
        map.animateToRegion(
          {
            latitude: destinyCoords.latitude,
            longitude: destinyCoords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          1000,
        );
      }
    };

    animationAndRouting();
  }, [origin, destiny]);

  /* HANDLERS */
  const onLongPress = useCallback((event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    useGoogleAutocompleteStore.getState().setDestiny({
      place_id: "-2",
      description: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
      structured_formatting: {
        main_text: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
        secondary_text: "Ubicación seleccionada",
      },
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
    });
    useGoogleAutocompleteStore
      .getState()
      .setQuery("destiny", `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
  }, []);

  const onPressMap = useCallback(() => {
    bottomSheetRef.current?.close();
  }, [bottomSheetRef]);

  const onMarkerSelect = useCallback((gasStation: GasStation) => {
    console.log(gasStation);
  }, []);

  /* ON ACTIVE */
  //need to bypasses a rendering bug with the maps library when painting markers
  //when the focus is regained
  useFocusEffect(
    useCallback(() => {
      setMapKey((k) => k + 1);

      return () => {
        useGoogleAutocompleteStore.getState().resetStore();
      };
    }, []),
  );

  return (
    <MapView
      style={StyleSheet.absoluteFill}
      key={mapKey}
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
      onPress={onPressMap}
      onPoiClick={onPressMap}
      onLongPress={onLongPress}
      initialRegion={initialRegion}>
      {origin?.coordinates && origin?.place_id !== "-1" && (
        <Marker
          coordinate={origin.coordinates}
          title="Origen"
          description={origin.description}
          pinColor="blue"
        />
      )}

      {destiny?.coordinates && (
        <Marker
          coordinate={destiny.coordinates}
          title="Destino"
          description={destiny.description}
          pinColor="purple"
        />
      )}

      {safeCoordinates && (
        <Polyline
          coordinates={safeCoordinates}
          strokeColor="#ff0000"
          strokeWidth={4}
        />
      )}

      {paintedGasStations.map((station) => (
        <MarkerGasStation
          key={station.id}
          gasStation={station}
          onPress={onMarkerSelect}
          color={getPriceColor(activeGasMargin, station.prices?.[FILTER_TO_PRICE_KEY[activeGasFilter]] || 0)}
        />
      ))}
    </MapView>
  );
}

export default memo(MapRoutes);
