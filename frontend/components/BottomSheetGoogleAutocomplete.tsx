import { ActivityIndicator, Keyboard, StyleSheet, View } from "react-native";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Colors } from "@/constants/colors";
import BottomSheet, { BottomSheetBackgroundProps, BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import ThemedText from "./ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";
import CardPrediction from "./CardPrediction";
import { getPlaceCoordinates } from "@/services/api";
import { predicction } from "@/types/types";

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <LinearGradient
      style={style}
      colors={[Colors.primaryOrange, Colors.primaryPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
};

const predictionPlaceHolder = () => (
  <View style={styles.emptyContainer}>
    <ThemedText
      style={styles.emptyText}
      size="l">
      No hay resultados
    </ThemedText>
  </View>
);

const BottomSheetGoogleAutocomplete = () => {
  const snapPoints = useMemo(() => ["70%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const listPredictions = useGoogleAutocompleteStore((state) => state.listPredictions);
  const isLoading = useGoogleAutocompleteStore((state) => state.isLoading);
  const sessionToken = useGoogleAutocompleteStore((state) => state.sesionToken);
  const displayBottomSheet = useGoogleAutocompleteStore((state) => state.displayBottomSheet);
  const activeInput = useGoogleAutocompleteStore((state) => state.activeInput);

  const setSessionToken = useGoogleAutocompleteStore((state) => state.setSessionToken);
  const setPredictions = useGoogleAutocompleteStore((state) => state.setPredictions);
  const setOrigin = useGoogleAutocompleteStore((state) => state.setOrigin);
  const setDestiny = useGoogleAutocompleteStore((state) => state.setDestiny);
  const setQuery = useGoogleAutocompleteStore((state) => state.setQuery);
  const handleCancelSearch = useGoogleAutocompleteStore((state) => state.handleCancelSearch);
  const setActiveInput = useGoogleAutocompleteStore((state) => state.setActiveInput);
  const setDisplayBottomSheet = useGoogleAutocompleteStore((state) => state.setDisplayBottomSheet);

  const handlePlaceSelect = async (place: predicction) => {
    Keyboard.dismiss();

    try {
      if (sessionToken !== null) {
        const coords = await getPlaceCoordinates(place.place_id, sessionToken);
        if (activeInput === "origin") {
          setOrigin(place);
          setQuery("origin", place.structured_formatting.main_text);
        } else {
          setDestiny(place);
          setQuery("destiny", place.structured_formatting.main_text);
        }
        console.log("📌 Coordenadas:", coords.latitude, coords.longitude);
      } else {
        console.error("Error buscando lugares: el session token es nulo");
      }
    } catch (error) {
      console.error("Error obteniendo coordenadas:", error);
    } finally {
      setSessionToken(null);
      setActiveInput(null);
      setDisplayBottomSheet(false);
      setPredictions([]);
    }
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        handleCancelSearch();
        setDisplayBottomSheet(false);
        setActiveInput(null);
        Keyboard.dismiss();
      }
    },
    [setDisplayBottomSheet, setActiveInput],
  );

  useEffect(() => {
    if (displayBottomSheet) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [displayBottomSheet]);

  useEffect(() => {
    setPredictions([]);
  }, [activeInput, setPredictions]);

  return (
    <BottomSheet
      style={styles.BottomSheet}
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      backgroundComponent={CustomBackground}>
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
          contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          renderItem={({ item }) => (
            <CardPrediction
              prediction={item}
              onPress={() => {
                handlePlaceSelect(item);
              }}
            />
          )}
        />
      )}
    </BottomSheet>
  );
};

export default memo(BottomSheetGoogleAutocomplete);

const styles = StyleSheet.create({
  BottomSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
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
});
