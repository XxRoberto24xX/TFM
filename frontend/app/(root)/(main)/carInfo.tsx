import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import CardCar from "@/components/CardCar";
import ErrorMessage from "@/components/ErrorMessage";
import FloatingButtonIcon from "@/components/FloatingButtonIcon";
import FloatingButtonText from "@/components/FloatingButtonText";
import TextInputBasic from "@/components/TextInputBasic";

import { useCarStore } from "@/stores/useCarsStore";

import { saveCar } from "@/services/api";
import { ApiError } from "@/types/types";
import { Colors } from "@/constants/colors";

import { capitalizeFirstLetter } from "@/utils/gasStationsUtils";

export default function CarInfo() {
  /* VARIABLES */
  const insets = useSafeAreaInsets();

  const selectedCar = useCarStore.getState().selectedCar;

  /* VARIABLES */
  const [brand, setBrand] = useState<string>(selectedCar ? selectedCar.brand : "[Marca]");
  const [model, setModel] = useState<string>(selectedCar ? selectedCar.model : "[Modelo]");
  const [plate, setPlate] = useState<string>(selectedCar ? selectedCar.plate : "[Matrícula]");
  const [consumption, setConsumption] = useState<string>(selectedCar ? String(selectedCar.consumption) : "[Consumo]");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* USEMEMO VARIABLES */
  const modifiedCar = useMemo(() => {
    const parsedConsumption = Number(consumption);

    return {
      brand: brand,
      model: model,
      plate: plate,
      consumption: isNaN(parsedConsumption) ? 0 : parsedConsumption,
    };
  }, [brand, model, plate, consumption]);

  /* HANDLERS */
  const onBackPress = useCallback(() => {
    router.back();
  }, []);

  const onBrandChange = useCallback((brand: string) => {
    if (brand === "") {
      setBrand("[Marca]");
      return;
    }
    setBrand(capitalizeFirstLetter(brand));
  }, []);

  const onModelChange = useCallback((model: string) => {
    if (model === "") {
      setModel("[Modelo]");
      return;
    }
    setModel(capitalizeFirstLetter(model));
  }, []);

  const onPlateChange = useCallback((plate: string) => {
    if (plate === "") {
      setPlate("[Matrícula]");
      return;
    }
    setPlate(capitalizeFirstLetter(plate));
  }, []);

  const onConsumptionChange = useCallback((consumption: string) => {
    if (consumption === "") {
      setConsumption("[Consumo]");
      return;
    }
    setConsumption(consumption);
  }, []);

  const onPressSave = useCallback(async () => {
    setLoading(true);
    setError("");

    if (plate === "[Matrícula]" || brand === "[Marca]" || model === "[Modelo]" || consumption === "[Consumo]") {
      setLoading(false);
      setError("Debes rellenar todos los campos");
      return;
    }

    try {
      const parsedConsumption = Number(consumption);
      await saveCar(plate, isNaN(parsedConsumption) ? 0 : parsedConsumption, brand, model);
      router.back();
    } catch (callError) {
      const apiError = callError as ApiError;
      setError(apiError.message);
      console.log("Save Car: " + apiError.message);
    } finally {
      setLoading(false);
    }
  }, [brand, consumption, model, plate]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FloatingButtonIcon
        style={styles.backButton}
        icon="arrow-back"
        onPress={onBackPress}
      />
      <CardCar car={modifiedCar} />
      <View style={styles.inputsView}>
        <TextInputBasic
          placeholder="Marca"
          value={brand === "[Marca]" ? "" : brand}
          onChangeText={onBrandChange}
        />
        <TextInputBasic
          placeholder="Modelo"
          value={model === "[Modelo]" ? "" : model}
          onChangeText={onModelChange}
        />
        <TextInputBasic
          placeholder="Matrícula"
          value={plate === "[Matrícula]" ? "" : plate}
          onChangeText={onPlateChange}
        />
        <TextInputBasic
          placeholder="Consumo"
          suffix=" cada €/100Km"
          keyboardType="decimal-pad"
          value={consumption === "[Consumo]" ? "" : consumption}
          onChangeText={onConsumptionChange}
        />
        {error ? (
          <ErrorMessage style={styles.errorMessage}>{error}</ErrorMessage>
        ) : (
          <View style={styles.errorSpacer}></View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color={Colors.primaryPink}
        />
      ) : (
        <FloatingButtonText
          style={styles.floatingButton}
          text="Guardar"
          onPress={onPressSave}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 64,
    gap: 48,
  },
  backButton: {
    marginRight: "auto",
  },
  inputsView: {
    alignItems: "center",
    gap: 24,
  },
  activityIndicator: {
    marginTop: "auto",
    alignSelf: "center",
    height: 54,
  },
  floatingButton: {
    marginTop: "auto",
    alignSelf: "center",
  },
  errorMessage: {
    marginTop: 20,
    maxWidth: "80%",
  },
  errorSpacer: {
    height: 36,
  },
});
