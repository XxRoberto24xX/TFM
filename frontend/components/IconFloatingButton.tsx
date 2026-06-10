import { Pressable, PressableProps, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";

import * as Haptics from "expo-haptics";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface Props extends PressableProps {
  icon: keyof typeof Ionicons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  iconProvider?: "ionicons" | "material";
  onPress: () => void;
}

export default function IconFloatingButton({
  icon,
  iconProvider = "ionicons",
  onPress,
  style,
  ...pressableProps
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.buttonPressed,
        typeof style === "function" ? style({ pressed }) : style,
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
        {/* 2. Renderizado condicional según el proveedor */}
        {iconProvider === "material" ? (
          <MaterialIcons
            name={icon as keyof typeof MaterialIcons.glyphMap}
            size={26}
            color={Colors.textPrimary}
          />
        ) : (
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={26}
            color={Colors.textPrimary}
          />
        )}
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
