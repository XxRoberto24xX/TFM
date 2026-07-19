import { memo, useCallback, useState } from "react";
import { Pressable, StyleSheet, TextInput, type TextInputProps, View } from "react-native";

import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";
import ThemedText from "./ThemedText";

interface Props extends TextInputProps {
  icon?: boolean;
  hideContent?: boolean;
  suffix?: string;
}

function TextInputBasic({
  placeholder,
  placeholderTextColor = Colors.textSecondary,
  icon = false,
  hideContent = false,
  suffix,
  style,
  ...TextInputProps
}: Props) {
  const [hide, setHide] = useState(hideContent);

  const onPressIcon = useCallback(() => {
    Haptics.selectionAsync();
    setHide(!hide);
  }, [hide]);

  return (
    <View style={[styles.inputPlaceholder, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={hide}
        {...TextInputProps}
      />

      {suffix && TextInputProps.value !== "" && (
        <ThemedText
          size="l"
          weight="regular"
          color={Colors.textSecondary}>
          {suffix}
        </ThemedText>
      )}

      {icon && (
        <Pressable
          style={styles.icon}
          onPress={onPressIcon}>
          <Ionicons
            name={hide ? "eye-off" : "eye"}
            size={24}
            color={Colors.textSecondary}
          />
        </Pressable>
      )}
    </View>
  );
}

export default memo(TextInputBasic);

const styles = StyleSheet.create({
  inputPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 2,
    backgroundColor: Colors.white,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Roboto_Medium",
    color: Colors.textSecondary,
  },
  icon: {
    paddingStart: 15,
  },
});
