import { memo, RefObject, useCallback, useEffect, useMemo } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, View } from "react-native";

import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";

import ListItemPrediction from "@/components/ListItemPrediction";
import ThemedText from "@/components/ThemedText";

import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";
import { useLocationStore } from "@/stores/useLocationStore";

import { getPlaceCoordinates } from "@/services/api";
import { Predicction } from "@/types/types";
import { Colors } from "@/constants/colors";

import BottomSheetThemed from "./layouts/BottomSheetThemed";

interface Props {
  bottomSheetRef: RefObject<BottomSheet | null>;
}

const predictionPlaceHolder = () => (
  <View style={styles.emptyContainer}>
    <ThemedText
      style={styles.emptyText}
      size="l">
      No hay resultados
    </ThemedText>
  </View>
);

function BottomSheetAutocomplete({ bottomSheetRef }: Props) {
  /* VARIABLES */
  const userLocation = useLocationStore((state) => state.userLocation);

  const listPredictions = useGoogleAutocompleteStore((state) => state.listPredictions);
  const isLoading = useGoogleAutocompleteStore((state) => state.isLoading);
  const activeInput = useGoogleAutocompleteStore((state) => state.activeInput);
  const displayBottomSheet = useGoogleAutocompleteStore((state) => state.displayBottomSheet);

  /* USEMEMO */
  const snapPoints = useMemo(() => ["70%"], []);

  const UserLocationOption = useMemo(() => {
    return {
      place_id: "-1",
      description: "Mi ubicación actual",
      structured_formatting: {
        main_text: "Ubicación actual",
        secondary_text: "Basado en el GPS de tu dispositivo",
      },
      coordinates: userLocation
        ? {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          }
        : undefined,
    };
  }, [userLocation]);

  /* HANDLERS */
  const onPlaceSelect = useCallback(async (place: Predicction) => {
    const sessionToken = useGoogleAutocompleteStore.getState().sesionToken;
    const activeInput = useGoogleAutocompleteStore.getState().activeInput;
    const mirrorValueId =
      activeInput === "origin"
        ? useGoogleAutocompleteStore.getState().origin?.place_id
        : useGoogleAutocompleteStore.getState().destiny?.place_id;

    Keyboard.dismiss();

    try {
      if (place.place_id === "-1") {
        if (activeInput === "origin") {
          useGoogleAutocompleteStore.getState().setOrigin(place);
          useGoogleAutocompleteStore.getState().setQuery("origin", place.structured_formatting.main_text);
        } else {
          useGoogleAutocompleteStore.getState().setDestiny(place);
          useGoogleAutocompleteStore.getState().setQuery("destiny", place.structured_formatting.main_text);
        }
      } else if (sessionToken !== null && mirrorValueId !== place.place_id) {
        const coords = await getPlaceCoordinates(place.place_id, sessionToken);
        const placeWithCoordinates: Predicction = {
          ...place,
          coordinates: coords,
        };
        if (activeInput === "origin") {
          useGoogleAutocompleteStore.getState().setOrigin(placeWithCoordinates);
          useGoogleAutocompleteStore
            .getState()
            .setQuery("origin", placeWithCoordinates.structured_formatting.main_text);
        } else {
          useGoogleAutocompleteStore.getState().setDestiny(placeWithCoordinates);
          useGoogleAutocompleteStore
            .getState()
            .setQuery("destiny", placeWithCoordinates.structured_formatting.main_text);
        }
      } else {
        useGoogleAutocompleteStore.getState().handleCancelSearch();
        useGoogleAutocompleteStore.getState().setDisplayBottomSheet(false);
        useGoogleAutocompleteStore.getState().setActiveInput(null);
        Keyboard.dismiss();
        console.log("Error buscando lugares: no pueden ser origen y destino iguales");
      }
    } catch (error) {
      console.log("Error obteniendo coordenadas:", error);
    } finally {
      useGoogleAutocompleteStore.getState().setSessionToken(null);
      useGoogleAutocompleteStore.getState().setActiveInput(null);
      useGoogleAutocompleteStore.getState().setDisplayBottomSheet(false);
      useGoogleAutocompleteStore.getState().setPredictions([]);
    }
  }, []);

  const onBottomSheetChange = useCallback((index: number) => {
    if (index === -1) {
      useGoogleAutocompleteStore.getState().handleCancelSearch();
      useGoogleAutocompleteStore.getState().setDisplayBottomSheet(false);
      useGoogleAutocompleteStore.getState().setActiveInput(null);
      Keyboard.dismiss();
    }
  }, []);

  /* WATCHERS */
  useEffect(() => {
    if (displayBottomSheet) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [displayBottomSheet, bottomSheetRef]);

  /* ON MOUNT */
  useEffect(() => {
    useGoogleAutocompleteStore.getState().setPredictions([]);
  }, []);

  /* ITEMS */
  const renderItem = useCallback(
    ({ item }: { item: Predicction }) => (
      <ListItemPrediction
        prediction={item}
        onPress={onPlaceSelect}
      />
    ),
    [onPlaceSelect],
  );

  return (
    <BottomSheetThemed
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={onBottomSheetChange}>
      {isLoading ? (
        <BottomSheetView style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.textPrimary}
          />
          <ThemedText
            style={styles.emptyText}
            size="l">
            Buscando lugares
          </ThemedText>
        </BottomSheetView>
      ) : (
        <BottomSheetFlatList
          data={listPredictions}
          keyExtractor={(item) => item.place_id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={predictionPlaceHolder}
          ListHeaderComponent={
            activeInput === "origin" && userLocation ? (
              <ListItemPrediction
                prediction={UserLocationOption}
                onPress={onPlaceSelect}
              />
            ) : null
          }
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      )}
    </BottomSheetThemed>
  );
}

export default memo(BottomSheetAutocomplete);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  listContainer: {
    gap: 8,
    paddingBottom: 8,
  },
});
