import React, { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import FloatingButton from "./layouts/FloatingButton";
import ThemedText from "./ThemedText";

interface Props {
  text: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const FloatingButtonText = ({ text, style, onPress }: Props) => {
  return (
    <FloatingButton
      style={style}
      onPress={onPress}>
      <View style={styles.container}>
        <ThemedText
          style={styles.text}
          size="xl">
          {text}
        </ThemedText>
      </View>
    </FloatingButton>
  );
};

export default memo(FloatingButtonText);

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  text: {
    textAlign: "center",
  },
});
