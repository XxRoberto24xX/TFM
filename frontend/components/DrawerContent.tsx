import { memo } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import ThemedText from "@/components/ThemedText";

import { useGasStationStore } from "@/stores/useGasStationsStore";

import { Colors } from "@/constants/colors";

import { closeDrawer } from "@/utils/DrawerController";

interface DrawerMenuItemProps {
  label: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}

function DrawerMenuItem({ label, iconName, onPress }: DrawerMenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
      onPress={() => {
        onPress();
        closeDrawer();
      }}>
      <MaterialCommunityIcons
        name={iconName}
        size={28}
        color={Colors.textPrimary}
      />
      <ThemedText size="l">{label}</ThemedText>
    </Pressable>
  );
}

function DrawerContent() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  const getCurrentRoute = () => {
    return `/${segments.join("/")}`;
  };

  const handleNavigation = (path: string) => {
    const currentRoute = getCurrentRoute();

    const cleanPath = path.replace(/^\/+/, "");
    const cleanCurrent = currentRoute.replace(/^\/+/, "");

    if (cleanCurrent !== cleanPath) {
      router.push(path);
    }
    closeDrawer();
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    useGasStationStore.getState().setFavorites(null);

    closeDrawer();
    router.replace("/login");
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.primaryOrange, Colors.primaryPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView
        style={[
          styles.scrollView,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}>
        <View style={styles.header}>
          <Image
            style={styles.backgroundImage}
            resizeMode="contain"
            source={require("@/assets/myIcon.png")}
          />
          <Text style={styles.appTitle}>Gas App</Text>
        </View>

        <View style={styles.menuContainer}>
          <DrawerMenuItem
            label="Home"
            iconName="home"
            onPress={() => handleNavigation("/(root)/(main)/home")}
          />
          <DrawerMenuItem
            label="Coches"
            iconName="car"
            onPress={() => handleNavigation("/(root)/(main)/cars")}
          />
          <DrawerMenuItem
            label="Cuenta"
            iconName="account"
            onPress={() => handleNavigation("/(root)/(main)/account")}
          />

          <DrawerMenuItem
            label="Cerrar Sesión"
            iconName="logout"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default memo(DrawerContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  backgroundImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
  },
  appTitle: {
    fontFamily: "Roboto_Bold",
    fontSize: 20,
    color: "#ffffff",
    textAlign: "center",
  },
  menuContainer: {
    gap: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
    borderRadius: 400,
  },
  menuItemPressed: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
});
