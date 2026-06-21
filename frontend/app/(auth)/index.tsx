import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MapType, Region } from "react-native-maps";

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { useGasStationStore } from "@/stores/useGasStationsStore";
import { useLocationStore } from "@/stores/useLocationStore";

import { Colors } from "@/constants/colors";

export default function Index() {
  const router = useRouter();

  const [isLocationFinish, setIsLocationFinish] = useState<boolean>(false);
  const [isPreferencesFinish, setIisPreferencesFinish] = useState<boolean>(false);

  /* WATCHERS */
  useEffect(() => {
    if (isLocationFinish && isPreferencesFinish) {
      router.replace("/login");
    }
  }, [isLocationFinish, isPreferencesFinish, router]);

  /* ON MOUNT */
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permiso a la ubicación Denegado");
          return;
        }

        let userLocation = await Location.getLastKnownPositionAsync({});
        if (!userLocation) {
          userLocation = await Location.getCurrentPositionAsync({});
        }

        useLocationStore.getState().setUserLocation(userLocation);

        const userRegion: Region = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        useLocationStore.getState().setLastRegion(userRegion);
        useLocationStore.getState().setIsCenteredOnUser(true);
      } catch (error: any) {
        if (error.message.includes("unsatisfied device settings")) {
          console.log("El usuario tiene el GPS apagado y rechazó activarlo en los ajustes.");
        } else {
          console.error("Otro error relacionado con la ubicación:", error);
        }
      } finally {
        setIsLocationFinish(true);
      }
    };

    const getUserPreferences = async () => {
      try {
        const mapType = await SecureStore.getItemAsync("mapType");
        useGasStationStore.getState().setMapType((mapType ?? "standard") as MapType);

        const gasOption = await SecureStore.getItemAsync("GasOptionSelected");
        useGasStationStore.getState().setActiveGasFilter(gasOption ?? "E5 95");

        const brandOption = await SecureStore.getItemAsync("BrandOptionSelected");
        useGasStationStore.getState().setActiveBrandFilter(brandOption ?? "Todos");
      } finally {
        setIisPreferencesFinish(true);
      }
    };

    getUserLocation();
    getUserPreferences();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={120}
        color={Colors.primaryPink}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
