import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { NavigationBar } from "expo-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(root)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
