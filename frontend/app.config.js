export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "myapp",

    ios: {
      supportsTablet: true,
    },

    android: {
      package: "com.anonymous.frontend",

      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },

      predictiveBackGestureEnabled: false,
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "react-native-maps",
        {
          androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      ],
    ],

    experiments: {
      tsconfigPaths: true,
    },
  },
};
