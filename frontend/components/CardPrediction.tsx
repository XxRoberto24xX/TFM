import { Pressable, PressableProps, StyleSheet } from "react-native";
import { memo } from "react";
import { predicction } from "@/types/types";
import ThemedText from "./ThemedText";
import { Colors } from "@/constants/colors";

interface Props extends PressableProps {
  prediction: predicction;
}

const CardPrediction = ({ prediction, ...pressableProps }: Props) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      {...pressableProps}>
      <ThemedText size="l">{prediction.structured_formatting.main_text}</ThemedText>
      <ThemedText
        style={{ marginTop: 6 }}
        size="s">
        {prediction.structured_formatting.secondary_text}
      </ThemedText>
    </Pressable>
  );
};

export default memo(CardPrediction);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 16,
    padding: 8,
    gap: 8,
  },
  containerPressed: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  infoView: {
    flexDirection: "column",
    flex: 1,
  },
  imageView: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 3,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  image: {
    width: 48,
    height: 48,
  },
});
