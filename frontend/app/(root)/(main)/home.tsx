import { StyleSheet, View } from "react-native";
import { useEffect, useRef } from "react";
import { ApiError } from "@/types/types";
import { getListFavorites } from "@/services/api";
import { useHeaderHeight } from "expo-router/build/react-navigation";
import MapView, { Region } from "react-native-maps";

import IconFloatingButton from "@/components/IconFloatingButton";
import FilterChipGas from "@/components/FilterChipGas";
import FilterChipBrands from "@/components/FilterChipBrands";
import CardGasStation from "@/components/CardGasStation";
import BottomSheetFavorites from "@/components/BottomSheetFavorites";
import MapHome from "@/components/MapHome";
import * as SecureStore from "expo-secure-store";

import { useLocationStore } from "@/stores/useLocationStore";
import { useGasStationStore } from "@/stores/useGasStationsStore";

export default function Home() {
  /* VARIABLES */
  const mapRef = useRef<MapView | null>(null);
  const headerHeight = useHeaderHeight();

  const userLocation = useLocationStore((state) => state.userLocation);
  const isCenteredOnUser = useLocationStore((state) => state.isCenteredOnUser);
  const mapType = useGasStationStore((state) => state.mapType);

  const setFavorites = useGasStationStore((state) => state.setFavorites);
  const setLastRegion = useLocationStore((state) => state.setLastRegion);
  const setIsCenteredOnUser = useLocationStore((state) => state.setIsCenteredOnUser);
  const setMapType = useGasStationStore((state) => state.setMapType);

  /* HANDLERS */
  const onGoToUserLocation = () => {
    if (userLocation && mapRef.current) {
      const userRegion: Region = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      mapRef.current.animateToRegion(userRegion);
      setLastRegion(userRegion);
      setIsCenteredOnUser(true);
    }
  };

  const onMapTypeChange = () => {
    const mapTypeChange = async () => {
      if (mapType === "standard") {
        setMapType("hybrid");
        await SecureStore.setItemAsync("mapType", "hybrid");
      } else {
        setMapType("standard");
        await SecureStore.setItemAsync("mapType", "standard");
      }
    };

    mapTypeChange();
  };

  /* ON MOUNT */
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getListFavorites();
        setFavorites(data.listFavoriteGasStation);
      } catch (callError) {
        const apiError = callError as ApiError;
        console.log("Fetch Favoritos: " + apiError.message);
      }
    };

    fetchFavorites();
  }, [setFavorites, setLastRegion, setIsCenteredOnUser]);

  return (
    <View style={styles.mapContainer}>
      <MapHome ref={mapRef} />
      <View style={[styles.mainViewContainer, { paddingTop: headerHeight }]}>
        <FilterChipBrands />
        <IconFloatingButton
          style={{ alignSelf: "flex-end", margin: 8 }}
          icon={"layers"}
          onPress={() => onMapTypeChange()}
        />
        <View style={{ marginTop: "auto" }}>
          <CardGasStation style={styles.gasStationPreview} />
          <View style={styles.bottomViewContainer}>
            <FilterChipGas />
            {userLocation && (
              <IconFloatingButton
                icon={isCenteredOnUser ? "gps-fixed" : "gps-not-fixed"}
                iconProvider="material"
                onPress={() => onGoToUserLocation()}
              />
            )}
          </View>
        </View>
      </View>
      <BottomSheetFavorites />
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  mainViewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 80,
  },
  gasStationPreview: {
    margin: 10,
  },
  bottomViewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginEnd: 10,
    marginBottom: 10,
  },
});
