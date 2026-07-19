import { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import FloatingButtonIcon from "@/components/FloatingButtonIcon";
import ListItemCar from "@/components/ListItemCar";
import ThemedText from "@/components/ThemedText";

import { useCarStore } from "@/stores/useCarsStore";

import { getListCars } from "@/services/api";
import { ApiError, Car } from "@/types/types";
import { Colors } from "@/constants/colors";

export default function Cars() {
  /* VARIABLES */
  const insets = useSafeAreaInsets();

  const listCars = useCarStore((state) => state.listCars);

  /* HANDLERS */
  const onBackPress = useCallback(() => {
    router.back();
  }, []);

  const onAdd = useCallback(() => {
    useCarStore.getState().setSelectedCar(null);
    router.push("/carInfo");
  }, []);

  const onCarSelect = useCallback((car: Car) => {
    useCarStore.getState().setSelectedCar(car);
    router.push("/carInfo");
  }, []);

  /* ON MOUNT */
  useEffect(() => {
    const getActualListCars = async () => {
      try {
        const response = await getListCars();
        useCarStore.getState().setListCars(response.cars);
      } catch (error) {
        const apiError = error as ApiError;
        console.log("Cars view: " + apiError.message);
      }
    };

    getActualListCars();
  }, []);

  /* ITEMS */
  const renderItem = useCallback(
    ({ item }: { item: Car }) => (
      <ListItemCar
        car={item}
        onPress={onCarSelect}
      />
    ),
    [onCarSelect],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.upperContainer}>
        <FloatingButtonIcon
          style={styles.backButton}
          icon="arrow-back"
          onPress={onBackPress}
        />
        <ThemedText
          style={styles.headerText}
          size="h2"
          color={Colors.textTertiary}>
          Mis Coches
        </ThemedText>
        <FloatingButtonIcon
          style={styles.addButton}
          icon={"add"}
          onPress={onAdd}
        />
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={listCars}
        keyExtractor={(item) => item.plate}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",

    paddingHorizontal: 16,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  addButton: {
    alignSelf: "flex-start",
    marginLeft: "auto",
  },
  list: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    gap: 16,
    paddingVertical: 16,
  },
  headerText: {
    marginLeft: "auto",
  },
});
