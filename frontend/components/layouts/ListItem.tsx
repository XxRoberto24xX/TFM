import { memo, ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface Props extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function ListItem({ children, style, ...pressableProps }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [style, styles.container, pressed && styles.containerPressed]}
      {...pressableProps}>
      {children}
    </Pressable>
  );
}

export default memo(ListItem);

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
});
