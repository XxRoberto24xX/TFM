import { Pressable, PressableProps, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";

import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface Props extends PressableProps {
  icon: IoniconsName;
  onPress: () => void;
}

export default function IconFloatingButton({ icon, onPress, style, ...pressableProps }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.buttonPressed,
        typeof style === "function" ? style({ pressed }) : style, // <- made to introduce de style only if its a stylesheet
      ]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.primaryOrange, Colors.primaryPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Ionicons
          name={icon}
          size={26}
          color={Colors.textPrimary}
        />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
    borderRadius: 30,
    overflow: "hidden",

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],

    // Shadow for IOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    // Shadow for Android
    elevation: 2,
  },
  gradient: {
    padding: 10,
  },
});
