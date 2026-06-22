import { memo } from "react";
import { Pressable, type PressableProps, StyleSheet } from "react-native";

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import ThemedText from "@/components/ThemedText";

import { Colors } from "../constants/colors";

interface Props extends PressableProps {
  text: string;
}

function FloatingButton({ text, onPress, style, onPressIn, ...pressableProps }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.buttonPressed,
        typeof style === "function" ? style({ pressed }) : style, // <- made to introduce de style only if its a stylesheet
      ]}
      onPress={(event) => {
        onPress?.(event);
        Haptics.selectionAsync();
      }}
      {...pressableProps}>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.primaryOrange, Colors.primaryPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <ThemedText
          style={styles.text}
          size="xl">
          {text}
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

export default memo(FloatingButton);

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
    minWidth: 200,
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
    paddingVertical: 15,
    paddingHorizontal: 45,
  },
  text: {
    textAlign: "center",
  },
});
