import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

import FloatingButton from "@/components/FloatingButton";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>home</Text>
      <FloatingButton
        style={{ marginTop: 45 }}
        text="Gas Station"
        onPress={() => router.push("/gasStation")}
      />
      <FloatingButton
        style={{ marginTop: 45 }}
        text="Rutas"
        onPress={() => router.push("/route")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
});
