import { memo, ReactNode } from "react";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function ChipsFilter({ children, style }: Props) {
  return (
    <ScrollView
      style={[style, styles.scrollView]}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      {children}
    </ScrollView>
  );
}

export default memo(ChipsFilter);

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
});
