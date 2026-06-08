import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { Image, StyleSheet, ScrollView, View, TouchableOpacity, Text } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { closeDrawer } from "@/utils/DrawerController";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DrawerMenuItemProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

function DrawerMenuItem({ label, iconName, onPress }: DrawerMenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        onPress();
        closeDrawer();
      }}>
      <Ionicons
        name={iconName}
        size={24}
        color="rgba(255, 255, 255, 0.75)"
      />
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function DrawerContent() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  /* Function to take the actual route the current display view has */
  const getCurrentScreenName = () => {
    const state = navigation.getState();
    if (state?.routes) {
      let currentRoute = state.routes[state.routes.length - 1];

      while (
        currentRoute &&
        "state" in currentRoute &&
        currentRoute.state?.routes &&
        currentRoute.state.index !== undefined
      ) {
        const nextRoute = currentRoute.state.routes[currentRoute.state.index];
        if (!nextRoute) break;
        currentRoute = nextRoute as any;
      }

      return currentRoute?.name;
    }
    return null;
  };

  const handleNavigation = (path: string) => {
    const currentScreen = getCurrentScreenName();
    const targetScreen = path.split("/").pop();

    if (currentScreen !== targetScreen) {
      router.push(path);
    }
    closeDrawer();
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    closeDrawer();
    router.replace("/");
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
            iconName="person-circle"
            onPress={() => handleNavigation("/(root)/(main)/account")}
          />

          <View style={styles.divider} />

          <DrawerMenuItem
            label="Cerrar Sesión"
            iconName="log-out-outline"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

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
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  menuLabel: {
    fontFamily: "Roboto_Bold",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.75)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 10,
  },
});
