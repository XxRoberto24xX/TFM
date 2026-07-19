import React, { memo, ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function Card({ children, style }: Props) {
  return (
    <LinearGradient
      style={[styles.container, style]}
      colors={[Colors.primaryOrange, Colors.primaryPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <View style={styles.innerContainer}>{children}</View>
    </LinearGradient>
  );
}

export default memo(Card);

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
  innerContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 8,
    padding: 8,
  },
});
