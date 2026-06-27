import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Region } from "react-native-maps";

import { useHeaderHeight } from "expo-router/build/react-navigation";
import * as SecureStore from "expo-secure-store";

import BottomSheetFavorites from "@/components/BottomSheetFavorites";
import CardGasStation from "@/components/CardGasStation";
import ChipsFilterBrands from "@/components/ChipsFilterBrands";
import ChipsFilterGas from "@/components/ChipsFilterGas";
import FloatingButtonIcon from "@/components/FloatingButtonIcon";
import MapHome from "@/components/MapHome";

import { useGasStationStore } from "@/stores/useGasStationsStore";
import { useLocationStore } from "@/stores/useLocationStore";

import { getListFavorites } from "@/services/api";
import { ApiError } from "@/types/types";

export default function Home() {
  /* VARIABLES */
  const mapRef = useRef<MapView | null>(null);
  const headerHeight = useHeaderHeight();

  const userLocation = useLocationStore((state) => state.userLocation);
  const isCenteredOnUser = useLocationStore((state) => state.isCenteredOnUser);

  /* HANDLERS */
  const onGoToUserLocation = useCallback(() => {
    const userLocation = useLocationStore.getState().userLocation;
    if (userLocation && mapRef.current) {
      const userRegion: Region = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      mapRef.current.animateToRegion(userRegion);
      useLocationStore.getState().setLastRegion(userRegion);
      useLocationStore.getState().setIsCenteredOnUser(true);
    }
  }, []);

  const onMapTypeChange = useCallback(() => {
    const mapType = useGasStationStore.getState().mapType;
    const mapTypeChange = async () => {
      if (mapType === "standard") {
        useGasStationStore.getState().setMapType("hybrid");
        await SecureStore.setItemAsync("mapType", "hybrid");
      } else {
        useGasStationStore.getState().setMapType("standard");
        await SecureStore.setItemAsync("mapType", "standard");
      }
    };

    mapTypeChange();
  }, []);

  /* ON MOUNT */
  useEffect(() => {
    const fetchFavorites = async () => {
      if (useGasStationStore.getState().listFavorites === null) {
        console.log("Ahora si que tengo que hacer yo la paticion");
        try {
          const data = await getListFavorites();
          useGasStationStore.getState().setFavorites(data.listFavoriteGasStation);
        } catch (callError) {
          const apiError = callError as ApiError;
          console.log("Fetch Favoritos: " + apiError.message);
        }
      }
    };

    fetchFavorites();
  }, []);

  return (
    <View style={styles.mapContainer}>
      <MapHome ref={mapRef} />
      <View style={[styles.mainViewContainer, { paddingTop: headerHeight }]}>
        <ChipsFilterBrands />
        <FloatingButtonIcon
          style={styles.mapTypeButton}
          icon="layers"
          onPress={onMapTypeChange}
        />
        <View style={styles.bottomView}>
          <CardGasStation style={styles.gasStationPreview} />
          <View style={styles.bottomViewContainer}>
            <ChipsFilterGas />
            {userLocation && (
              <FloatingButtonIcon
                icon={isCenteredOnUser ? "gps-fixed" : "gps-not-fixed"}
                iconProvider="material"
                onPress={onGoToUserLocation}
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
    alignItems: "center",
    gap: 10,
    marginEnd: 10,
    marginBottom: 10,
  },
  mapTypeButton: {
    alignSelf: "flex-end",
    margin: 8,
  },
  bottomView: {
    marginTop: "auto",
  },
});
