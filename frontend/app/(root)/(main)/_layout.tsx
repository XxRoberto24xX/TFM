import { Image, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";

import FloatingButtonIcon from "@/components/FloatingButtonIcon";
import ThemedText from "@/components/ThemedText";

import { Colors } from "@/constants/colors";

import { openDrawer } from "@/utils/DrawerController";

export default function MainLayout() {
  return (
    <Stack
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
      }}>
      <Stack.Screen
        name="home"
        options={{
          headerTransparent: true,
          headerShadowVisible: false,
          headerBackground: () => null,

          headerLeft: () => (
            <FloatingButtonIcon
              icon="menu"
              onPress={() => {
                openDrawer();
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
            <FloatingButtonIcon
              icon="route"
              onPress={() => {
                router.push("/route");
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="cars"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="carInfo"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "Cuenta",
        }}
      />
    </Stack>
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
