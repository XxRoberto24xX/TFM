import { memo } from "react";
import { StyleSheet } from "react-native";

import { Predicction } from "@/types/types";

import ListItem from "./layouts/ListItem";
import ThemedText from "./ThemedText";

interface Props {
  prediction: Predicction;
  onPress: (place: Predicction) => void;
}

function ListItemPrediction({ prediction, onPress }: Props) {
  /* HANDLERS */
  const onPressItem = () => {
    onPress(prediction);
  };

  return (
    <ListItem onPress={onPressItem}>
      <ThemedText size="l">{prediction.structured_formatting.main_text}</ThemedText>
      <ThemedText
        style={styles.text}
        size="s">
        {prediction.structured_formatting.secondary_text}
      </ThemedText>
    </ListItem>
  );
}

export default memo(ListItemPrediction);

const styles = StyleSheet.create({
  text: {
    marginTop: 6,
  },
});
