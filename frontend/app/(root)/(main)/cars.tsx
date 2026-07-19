import { useCallback, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";

import FloatingButtonIcon from "@/components/FloatingButtonIcon";
import ListItemCar from "@/components/ListItemCar";
import ThemedText from "@/components/ThemedText";

import { useCarStore } from "@/stores/useCarsStore";

import { deleteCar, getListCars } from "@/services/api";
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

  const onPressDelete = useCallback(
    (plate: string) => async () => {
      try {
        useCarStore.getState().removeCar(plate);
        await deleteCar(plate);
      } catch (callError) {
        const apiError = callError as ApiError;
        console.log("Save Car: " + apiError.message);
      }
    },
    [],
  );

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
    ({ item }: { item: Car }) => {
      const renderSwipe = () => (
        <Pressable
          style={styles.deleteButton}
          onPress={onPressDelete(item.plate)}>
          <MaterialIcons
            name={"delete"}
            size={32}
            color={"#ff0101"}
          />
        </Pressable>
      );

      return (
        <Swipeable renderRightActions={renderSwipe}>
          <ListItemCar
            style={styles.items}
            car={item}
            onPress={onCarSelect}
          />
        </Swipeable>
      );
    },
    [onCarSelect, onPressDelete],
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
    marginTop: 16,
  },
  listContent: {
    padding: 8,
  },
  items: {
    marginBottom: 16,
    marginHorizontal: 8,
  },
  headerText: {
    marginLeft: "auto",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    backgroundColor: "#fd9292",
    borderRadius: 16,
    marginBottom: 16,
  },
});
