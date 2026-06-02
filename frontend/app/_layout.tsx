import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/Colors";
import { useFonts } from "expo-font";
import { NavigationBar } from "expo-navigation-bar";

const isAndroid = Platform.OS === "android";

if (isAndroid) {
  NavigationBar.setHidden(true);
}

export default function Layout() {
  const [loaded] = useFonts({
    Roboto_Regular: require("../assets/fonts/Roboto-Regular.ttf"),
    Roboto_Bold: require("../assets/fonts/Roboto-Bold.ttf"),
    Roboto_Medium: require("../assets/fonts/Roboto-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Slot />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
