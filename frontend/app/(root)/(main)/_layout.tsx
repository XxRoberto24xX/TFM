import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CunstomDrawerContent from "@/components/CunstomDrawerContent";

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CunstomDrawerContent}
        screenOptions={{
          headerBackground: () => (
            <LinearGradient
              colors={[Colors.primaryOrange, Colors.primaryPink]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
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

          drawerLabelStyle: {
            fontFamily: "Roboto_Bold", // Puedes usar tu fuente personalizada aquí también
            fontSize: 16,
          },
          drawerActiveTintColor: Colors.textPrimary,
          drawerActiveBackgroundColor: "rgba(255, 255, 255, 0.2)",
          drawerInactiveTintColor: "rgba(255, 255, 255, 0.75)",
        }}>
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({ color, size }) => {
              return (
                <Ionicons
                  name="home"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Drawer.Screen
          name="cars"
          options={{
            drawerLabel: "Coches",
            title: "Coches",
            drawerIcon: ({ color, size }) => {
              return (
                <Ionicons
                  name="car"
                  size={size}
                  color={color}
                />
              );
            },

            headerRight: () => {
              return (
                <Ionicons
                  name="add"
                  size={30}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              );
            },
          }}
        />
        <Drawer.Screen
          name="account"
          options={{
            drawerLabel: "Cuenta",
            title: "Cuenta",
            drawerIcon: ({ color, size }) => {
              return (
                <Ionicons
                  name="person-circle"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
