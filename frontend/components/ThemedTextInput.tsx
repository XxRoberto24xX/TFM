import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { Colors } from "../constants/Colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import * as Haptics from "expo-haptics";

interface Props extends TextInputProps {
  placeholder: string;
  placeholderTextColor?: string;
  icon?: boolean;
  hideContent?: boolean;
}

export default function ThemedTextInput({
  placeholder,
  placeholderTextColor = Colors.textSecondary,
  icon = false,
  hideContent = false,
  style,
  ...TextInputProps
}: Props) {
  const [hide, setHide] = useState(hideContent);

  return (
    <View style={[styles.inputPlaceholder, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={hide}
        {...TextInputProps}
      />

      {icon && (
        <Pressable
          style={styles.icon}
          onPress={() => {
            Haptics.selectionAsync();
            setHide(!hide);
          }}>
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

const styles = StyleSheet.create({
  inputPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
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
