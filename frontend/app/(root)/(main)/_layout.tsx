import { StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CunstomDrawerContent from "@/components/CunstomDrawerContent";
import IconFloatingButton from "@/components/IconFloatingButton";
import ThemedText from "@/components/ThemedText";

import * as Haptics from "expo-haptics";

export default function DraweLayout() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CunstomDrawerContent}
        screenOptions={{
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

          drawerLabelStyle: {
            fontFamily: "Roboto_Bold",
            fontSize: 16,
          },
          drawerActiveTintColor: Colors.textPrimary,
          drawerActiveBackgroundColor: "rgba(255, 255, 255, 0.2)",
          drawerInactiveTintColor: "rgba(255, 255, 255, 0.75)",
        }}>
        <Drawer.Screen
          name="home"
          options={({ navigation }) => ({
            drawerLabel: "Home",
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackground: () => null,

            headerLeft: () => (
              <IconFloatingButton
                style={{ marginHorizontal: 10 }}
                icon="menu"
                onPress={() => {
                  Haptics.selectionAsync();
                  navigation.openDrawer();
                }}
              />
            ),

            headerTitle: () => (
              <LinearGradient
                style={styles.gradient}
                colors={[Colors.primaryOrange, Colors.primaryPink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Image
                  style={styles.backgroundImage}
                  resizeMode="contain"
                  source={require("@/assets/myIcon.png")}
                />
                <ThemedText
                  style={{ textAlign: "center" }}
                  size="h2">
                  Gas App
                </ThemedText>
              </LinearGradient>
            ),

            headerRight: () => (
              <IconFloatingButton
                style={{ marginHorizontal: 10 }}
                icon="map"
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push("/route");
                }}
              />
            ),

            drawerIcon: ({ color, size }) => (
              <Ionicons
                name="home"
                size={size}
                color={color}
              />
            ),
          })}
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

const styles = StyleSheet.create({
  backgroundImage: {
    alignSelf: "center",
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  gradient: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 10,
    padding: 10,
    borderRadius: 30,
    gap: 5,
  },
});
