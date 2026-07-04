import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Details, PROVIDER_GOOGLE, Region } from "react-native-maps";

import BottomSheet from "@gorhom/bottom-sheet";

import MarkerGasStation from "@/components/MarkerGasStation";

import { useGasStationStore } from "@/stores/useGasStationsStore";
import { useLocationStore } from "@/stores/useLocationStore";

import { getGasStationsInRange } from "@/services/api";
import { ApiError, GasStation } from "@/types/types";
import { Colors } from "@/constants/colors";
import { DEFAULT_REGION, FILTER_TO_PRICE_KEY, MAX_LATITUDE_DELTA_FOR_MARKERS } from "@/constants/values";

import { getPriceColor } from "@/utils/gasStationsUtils";

interface Props {
  ref?: RefObject<MapView | null>;
  bottomSheetRef: RefObject<BottomSheet | null>;
}

const LOADING_THRESHOLD_MS = 500;

function MapHome({ ref, bottomSheetRef }: Props) {
  /* VARIABLES */
  const [returnedGasStations, setReturnedGasStations] = useState<GasStation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialRegion = useLocationStore.getState().lastRegion || DEFAULT_REGION;

  const mapType = useGasStationStore((state) => state.mapType);
  const activeBrandFilter = useGasStationStore((state) => state.activeBrandFilter);
  const activeGasFilter = useGasStationStore((state) => state.activeGasFilter);
  const activeGasMargin = useGasStationStore((state) => state.getActiveGasMargin());

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
  const onRegionChanged = useCallback(async (region: Region, details: Details) => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

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
        useGasStationStore.getState().setReturnedMargins(data.priceMargins);
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

    if (details?.isGesture) {
      useLocationStore.getState().setIsCenteredOnUser(false);
    }
  }, []);

  const onMapPressed = useCallback(() => {
    useGasStationStore.getState().setSelectedGasStation(null);
    bottomSheetRef?.current?.snapToIndex(0);
  }, [bottomSheetRef]);

  const onMarkerSelect = useCallback(
    (gasStation: GasStation) => {
      useGasStationStore.getState().setSelectedGasStation(gasStation);
      bottomSheetRef?.current?.snapToIndex(0);
      useLocationStore.getState().setIsCenteredOnUser(false);
    },
    [bottomSheetRef],
  );

  /* WATCHERS */
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
        ref={ref}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        mapType={mapType}
        onPress={onMapPressed}
        onPoiClick={onMapPressed}
        onRegionChangeComplete={onRegionChanged}
        initialRegion={initialRegion}
        moveOnMarkerPress={false}>
        {paintedGasStations.map((station) => (
          <MarkerGasStation
            key={station.id}
            gasStation={station}
            onPress={onMarkerSelect}
            color={getPriceColor(activeGasMargin, station.prices?.[FILTER_TO_PRICE_KEY[activeGasFilter]] || 0)}
          />
        ))}
      </MapView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={Colors.textPrimary}
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
