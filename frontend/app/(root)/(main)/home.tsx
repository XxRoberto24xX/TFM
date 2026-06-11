import { StyleSheet, View } from "react-native";
import { useEffect, useRef } from "react";
import { ApiError } from "@/types/types";
import { getListFavorites } from "@/services/api";
import { useHeaderHeight } from "expo-router/build/react-navigation";
import MapView, { Region } from "react-native-maps";

import * as Location from "expo-location";
import IconFloatingButton from "@/components/IconFloatingButton";
import GasOptionsDisplay from "@/components/GasOptionsDisplay";
import BrandsOptionsDisplay from "@/components/BrandsOptionsDisplay";
import GasStationPreview from "@/components/GasStationPreview";
import FavoritesBottomSheet from "@/components/FavoritesBottomSheet";

import Map from "@/components/Map";
import { useLocationStore } from "@/stores/useLocationStore";
import { useGasStationStore } from "@/stores/useGasStationsStore";

export default function Home() {
  /* VARIABLES */
  const mapRef = useRef<MapView | null>(null);
  const headerHeight = useHeaderHeight();

  const userLocation = useLocationStore((state) => state.userLocation);
  const isCenteredOnUser = useLocationStore((state) => state.isCenteredOnUser);

  const setFavorites = useGasStationStore((state) => state.setFavorites);
  const setLastRegion = useLocationStore((state) => state.setLastRegion);
  const setUserLocation = useLocationStore((state) => state.setUserLocation);
  const setIsCenteredOnUser = useLocationStore((state) => state.setIsCenteredOnUser);

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

  /* VARIABLE WATCHERS */
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const userRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setLastRegion(userRegion);
      mapRef.current.animateToRegion(userRegion, 1000);
      setIsCenteredOnUser(true);
    }
  }, [userLocation]);

  /* ON MOUNT */
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getListFavorites();
        setFavorites(data.gasStations);
      } catch (callError) {
        const apiError = callError as ApiError;
        console.log("Fetch Favoritos: " + apiError.message);
      }
    };

    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permiso a la ubicación Denegado");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setUserLocation(userLocation);
    };

    getUserLocation();
    fetchFavorites();
  }, []);

  return (
    <View style={styles.mapContainer}>
      <Map ref={mapRef} />
      <View style={[styles.mainViewContainer, { paddingTop: headerHeight }]}>
        <BrandsOptionsDisplay />
        <View style={{ marginTop: "auto" }}>
          <GasStationPreview style={{ margin: 10 }} />
          <View style={styles.bottomViewContainer}>
            <GasOptionsDisplay />
            <IconFloatingButton
              icon={isCenteredOnUser ? "gps-fixed" : "gps-not-fixed"}
              iconProvider="material"
              onPress={() => onGoToUserLocation()}
            />
          </View>
        </View>
      </View>
      <FavoritesBottomSheet />
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
  bottomViewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginEnd: 10,
    marginBottom: 10,
  },
});
