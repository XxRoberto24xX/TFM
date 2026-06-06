import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function GasStation() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Stack.Screen
        options={{
          title: `Elemento ${id}`, // Aquí usas el ID dinámico
          headerTitleAlign: "center", // Opciones extra que quieras añadir
        }}
      />

      <Text>Viendo el ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
