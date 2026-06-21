import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/colors";

export default function cars() {
  return (
    <View style={styles.container}>
      <Text>account</Text>
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
