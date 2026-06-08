import { Text, type TextProps } from "react-native";
import { Colors } from "../constants/colors";

interface Props extends TextProps {
  size: "h1" | "h2" | "xl" | "l" | "m" | "s";
  color?: string;
  weight?: "regular" | "medium" | "bold";
}

const SIZES = {
  h1: 52,
  h2: 24,
  xl: 18,
  l: 16,
  m: 14,
  s: 12,
};

const FONTS = {
  regular: "Roboto_Regular",
  medium: "Roboto_Medium",
  bold: "Roboto_Bold",
};

export default function ThemedText({
  size,
  color = Colors.textPrimary,
  weight = "bold",
  children,
  style,
  ...textProps
}: Props) {
  return (
    <Text
      style={[
        {
          color,
          fontSize: SIZES[size],
          fontFamily: FONTS[weight],
        },
        style,
      ]}
      {...textProps}>
      {children}
    </Text>
  );
}
