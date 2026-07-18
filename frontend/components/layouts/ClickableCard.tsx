import React, { memo, ReactNode } from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";

interface Props extends PressableProps {
  children: ReactNode;
}

function ClickableCard({ children, style, ...pressableProps }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.previewPressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...pressableProps}>
      <LinearGradient
        colors={[Colors.primaryOrange, Colors.primaryPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        {children}
      </LinearGradient>
    </Pressable>
  );
}

export default memo(ClickableCard);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 16,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  previewPressed: {
    transform: [{ scale: 0.96 }],

    // Shadow for IOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    // Shadow for Android
    elevation: 2,
  },
});
