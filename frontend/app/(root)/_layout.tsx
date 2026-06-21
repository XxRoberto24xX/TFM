import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";

import CustomDrawerLayout from "@/components/CustomDrawerLayout";

import { Colors } from "@/constants/colors";

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CustomDrawerLayout>
        <Stack
          screenOptions={{
            animation: "ios_from_right",
            headerBackground: () => (
              <LinearGradient
                colors={[Colors.primaryOrange, Colors.primaryPink]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={[
                  StyleSheet.absoluteFill,
                  {
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    overflow: "hidden",
                  },
                ]}
              />
            ),

            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Roboto_Bold",
              fontSize: 24,
            },
            headerTintColor: Colors.textPrimary,
          }}>
          <Stack.Screen
            name="(main)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="[id]" />
          <Stack.Screen
            name="route"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </CustomDrawerLayout>
    </GestureHandlerRootView>
  );
}
