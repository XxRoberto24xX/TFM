import { FlatList, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";

import FavoriteCard from "@/components/FavoriteCard";
import { useState, useEffect, useRef } from "react";
import { ApiError, gasStation, gasStationWithPrice } from "@/types/types";
import { getListFavorites, getGasStationsInRange } from "@/services/api";
import MapView, { PROVIDER_GOOGLE, Region, Marker } from "react-native-maps";

import FloatingButton from "@/components/FloatingButton";

import * as Location from "expo-location";

export default function Home() {
  /* VARIABLES */
  const mapRef = useRef<MapView | null>(null);

  const [favorites, setFavorites] = useState<gasStation[]>([]);
  const [paintedGasStations, setPaintedGasStataions] = useState<gasStationWithPrice[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  /* HANDLERS */
  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const paintGasStationsInRange = async (region: Region) => {
    const north = region.latitude + region.latitudeDelta / 2;
    const south = region.latitude - region.latitudeDelta / 2;
    const east = region.longitude + region.longitudeDelta / 2;
    const west = region.longitude - region.longitudeDelta / 2;

    try {
      const data = await getGasStationsInRange(north, south, east, west);
      setPaintedGasStataions(data.listGasStations);
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Get Elements In Region: " + apiError.message);
    }
  };

  /* VEIW ON MOUNT ACCTIONS */
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
      setLocation(userLocation);
    };

    fetchFavorites();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flexGrow: 0 }}
        data={favorites} // 1. Pasamos el array de datos
        keyExtractor={(item: gasStation) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 15 }}
        renderItem={({ item }) => (
          <FavoriteCard
            gasStation={item}
            onPress={() => {
              console.log("Hola buenos dias");
            }}
          />
        )}
      />
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFill}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChangeComplete={(region) => {
            paintGasStationsInRange(region);
          }}
          initialRegion={
            location
              ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : {
                  latitude: 40.4168,
                  longitude: -3.7038,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
          }>
          {paintedGasStations?.map((station: gasStationWithPrice) => {
            return (
              <Marker
                key={station.id}
                coordinate={{ latitude: station.latitude, longitude: station.longitude }}
                title={station.direction}
                description={"Diesel" + station.prices.diesel}
                pinColor="red"
              />
            );
          })}
        </MapView>
        <FloatingButton
          style={styles.locationButton}
          text="Hola"
          onPress={centerOnUser}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.background,
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
  },
  locationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
