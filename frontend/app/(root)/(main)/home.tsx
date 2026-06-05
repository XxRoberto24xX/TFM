import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useState, useEffect, useRef } from "react";
import { ApiError, gasStation, gasStationWithPrice, price } from "@/types/types";
import { getListFavorites, getGasStationsInRange } from "@/services/api";
import { useHeaderHeight } from "expo-router/build/react-navigation";
import MapView, { PROVIDER_GOOGLE, Region, Marker } from "react-native-maps";

import * as Location from "expo-location";
import IconFloatingButton from "@/components/IconFloatingButton";
import GasOptionsDisplay from "@/components/GasOptionsDisplay";
import BrandsOptionsDisplay from "@/components/BrandsOptionsDisplay";

const FILTER_TO_PRICE_KEY: Record<string, keyof Omit<price, "date">> = {
  "E5 95": "gasoline95",
  "E5 98": "gasoline98",
  "Diesel A": "diesel",
  "Diesel B": "diesel",
  "Diesel +": "diesel",
  "Gas Natural": "diesel",
  Biocombustible: "diesel",
};

export default function Home() {
  /* VARIABLES */
  const mapRef = useRef<MapView | null>(null);
  const headerHeight = useHeaderHeight();

  const [favorites, setFavorites] = useState<gasStation[]>([]);
  const [paintedGasStations, setPaintedGasStataions] = useState<gasStationWithPrice[]>([]);
  const [returnedGasStations, setReturnedGasStations] = useState<gasStationWithPrice[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [activeGasFilter, setActiveGasFilter] = useState<string>("E5 95");
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>("TODOS");

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
      setReturnedGasStations(data.listGasStations);
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Get Elements In Region: " + apiError.message);
    }
  };

  /* AUXILIAR FUNCTIONS */
  const getMarkerGasDisplayInfo = (station: gasStationWithPrice) => {
    // Si hay un filtro seleccionado y existe en nuestro diccionario, buscamos esa clave
    const priceKey = activeGasFilter ? FILTER_TO_PRICE_KEY[activeGasFilter] : null;

    if (priceKey && station.prices && station.prices[priceKey] !== undefined) {
      const price = station.prices[priceKey];
      return `${activeGasFilter}: ${price}€`;
    }
  };

  /* VARIABLE WATCHERS */
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

  useEffect(() => {
    const filterGasStations = async () => {
      if (!returnedGasStations || returnedGasStations.length === 0) {
        setPaintedGasStataions([]);
        return;
      }

      const filteredStations = returnedGasStations.filter((station) => {
        const matchesBrand =
          activeBrandFilter === "Todos" || station.brand.toUpperCase() === activeBrandFilter.toUpperCase();

        const priceKey = FILTER_TO_PRICE_KEY[activeGasFilter];

        const hasPrice = station.prices && station.prices[priceKey] !== undefined && station.prices[priceKey] > 0;

        // Para que la gasolinera se quede en la lista final, debe cumplir AMBOS filtros
        return matchesBrand && hasPrice;
      });

      if (!filteredStations || filteredStations.length === 0) {
        console.log("No hay ninguna conincidencia");
      }

      setPaintedGasStataions(filteredStations);
    };

    filterGasStations();
  }, [returnedGasStations, activeBrandFilter, activeGasFilter]);

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

  return (
    <View style={styles.mapContainer}>
      <StatusBar style="dark" />
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
              description={getMarkerGasDisplayInfo(station)}
              pinColor="red"
            />
          );
        })}
      </MapView>
      <View style={[styles.mainViewContainer, { paddingTop: headerHeight }]}>
        <BrandsOptionsDisplay
          selectedFilter={activeBrandFilter}
          onSelectFilter={(filter) => setActiveBrandFilter(filter)}
        />
        <View style={styles.bottomViewContainer}>
          <GasOptionsDisplay
            selectedFilter={activeGasFilter}
            onSelectFilter={(filter) => setActiveGasFilter(filter)}
          />
          <IconFloatingButton
            icon="locate"
            onPress={() => centerOnUser()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  mainViewContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "flex-start",
  },
  bottomViewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: "auto",
    gap: 10,
    marginEnd: 10,
    marginVertical: 10,
  },
});
