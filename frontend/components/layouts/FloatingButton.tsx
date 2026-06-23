import { memo, ReactNode } from "react";
import { GestureResponderEvent, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "../../constants/colors";

interface Props extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function FloatingButton({ children, style, onPress, ...pressableProps }: Props) {
  /* HANDLERS */
  const onButtonPress = (event: GestureResponderEvent) => {
    onPress?.(event);
    Haptics.selectionAsync();
  };

  return (
    <Pressable
      style={({ pressed }) => [style, styles.buttonContainer, pressed && styles.buttonPressed]}
      onPress={onButtonPress}
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

export default memo(FloatingButton);

const styles = StyleSheet.create({
  buttonContainer: {
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
});
