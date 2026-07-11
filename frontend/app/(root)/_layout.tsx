import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Stack } from "expo-router";

import CustomDrawerLayout from "@/components/CustomDrawerLayout";

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CustomDrawerLayout>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "ios_from_right",
          }}>
          <Stack.Screen name="(main)" />
          <Stack.Screen name="[id]" />
          <Stack.Screen name="route" />
        </Stack>
      </CustomDrawerLayout>
    </GestureHandlerRootView>
  );
}
