import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

import { useFocusEffect } from "expo-router";

import MarkerGasStation from "@/components/MarkerGasStation";

import { useGasStationStore } from "@/stores/useGasStationsStore";
import { useLocationStore } from "@/stores/useLocationStore";

import { getGasStationsInRange } from "@/services/api";
import { ApiError, GasStation } from "@/types/types";
import { DEFAULT_REGION, FILTER_TO_PRICE_KEY, MAX_LATITUDE_DELTA_FOR_MARKERS } from "@/constants/values";

interface Props {
  ref?: RefObject<MapView | null>;
}

function MapHome({ ref }: Props) {
  /* VARIABLES */
  const LOADING_THRESHOLD_MS = 500;

  const [returnedGasStations, setReturnedGasStations] = useState<GasStation[]>([]);
  const [mapKey, setMapKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeBrandFilter = useGasStationStore((state) => state.activeBrandFilter);
  const activeGasFilter = useGasStationStore((state) => state.activeGasFilter);
  const mapType = useGasStationStore((state) => state.mapType);
  const lastRegion = useLocationStore.getState().lastRegion;

  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(true);
    }, LOADING_THRESHOLD_MS);

    useLocationStore.getState().setLastRegion(region);

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

        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setIsLoading(false);
      }
    } else {
      setReturnedGasStations([]);
    }
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setIsLoading(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [paintedGasStations]);

  /* ON ACTIVE */
  useFocusEffect(
    useCallback(() => {
      setMapKey((k) => k + 1);
    }, []),
  );

  /* ON UNMOUNT */
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        style={StyleSheet.absoluteFill}
        key={mapKey}
        ref={ref}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        mapType={mapType}
        onPress={() => useGasStationStore.getState().setSelectedGasStation(null)}
        onPoiClick={() => {
          useGasStationStore.getState().setSelectedGasStation(null);
        }}
        onRegionChangeComplete={(region, details) => {
          onRegionChanged(region);
          if (details?.isGesture) {
            useLocationStore.getState().setIsCenteredOnUser(false);
          }
        }}
        initialRegion={lastRegion ?? DEFAULT_REGION}>
        {paintedGasStations.map((station) => (
          <MarkerGasStation
            key={station.id}
            gasStation={station}
          />
        ))}
      </MapView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#FFFFFF"
            />
            <Text style={styles.loadingText}> Cargando Gasolineras ... </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default memo(MapHome);

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 150,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
