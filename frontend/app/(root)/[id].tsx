import { Text, View } from "react-native";

import { Stack, useLocalSearchParams } from "expo-router";

export default function GasStation() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Stack.Screen
        options={{
          title: `Elemento ${id}`,
          headerTitleAlign: "center",
        }}
      />

      <Text>Viendo el ID: {id}</Text>
    </View>
  );
}
