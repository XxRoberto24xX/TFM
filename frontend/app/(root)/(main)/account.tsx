import { useCallback, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { MaterialIcons } from "@expo/vector-icons";

import ErrorMessage from "@/components/ErrorMessage";
import FloatingButtonText from "@/components/FloatingButtonText";
import TextInputBasic from "@/components/TextInputBasic";
import ThemedText from "@/components/ThemedText";

import { changePassword, deleteAccount } from "@/services/api";
import { ApiError } from "@/types/types";
import { Colors } from "@/constants/colors";

export default function Account() {
  const imageSource = require("@/assets/defaultUserImage.png");

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  /* HANDLERS  */
  const onOldPasswordChange = useCallback((text: string) => {
    setOldPassword(text);
  }, []);

  const onNewPasswordChange = useCallback((text: string) => {
    setNewPassword(text);
  }, []);

  const onPressChangePassword = useCallback(async () => {
    setError("");

    try {
      await changePassword(newPassword, oldPassword);
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Account: " + apiError.message);
      setError(apiError.message);
    }
  }, [newPassword, oldPassword]);

  const onPressDeleteAccount = useCallback(async () => {
    setError("");

    try {
      await deleteAccount();
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Account: " + apiError.message);
      setError(apiError.message);
    }
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.primaryOrange, Colors.primaryPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Image
          style={styles.userImage}
          source={imageSource}
        />
        <View style={styles.emailContainer}>
          <MaterialIcons
            name="email"
            size={24}
            color={Colors.textPrimary}
          />
          <ThemedText
            size="m"
            color={Colors.textPrimary}
            weight="regular">
            gonzaleznavasroberto@gmail.com
          </ThemedText>
        </View>
      </LinearGradient>

      <View style={styles.passwordContainer}>
        <LinearGradient
          style={styles.gradient}
          colors={[Colors.primaryOrange, Colors.primaryPink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <TextInputBasic
            placeholder="Nueva Contraseña"
            icon={true}
            hideContent={true}
            value={oldPassword}
            onChangeText={onOldPasswordChange}
          />

          <TextInputBasic
            placeholder="Contraseña Actual"
            icon={true}
            hideContent={true}
            value={newPassword}
            onChangeText={onNewPasswordChange}
          />
        </LinearGradient>

        {error ? <ErrorMessage>{error}</ErrorMessage> : <View style={styles.errorPlaceHolder} />}

        <FloatingButtonText
          text="Cambiar Contraseña"
          icon="lock-reset"
          onPress={onPressChangePassword}
        />
      </View>

      <FloatingButtonText
        style={styles.deleteAccountButton}
        text="Borrar Cuenta"
        icon="trash-can-outline"
        iconProvider="comunity"
        onPress={onPressDeleteAccount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 40,
    gap: 48,
  },
  gradient: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
    gap: 16,
    borderRadius: 32,

    shadowColor: Colors.black,

    // Shadow for IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  passwordContainer: {
    alignItems: "center",
    gap: 8,
  },
  errorPlaceHolder: {
    height: 16,
  },
  deleteAccountButton: {
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: 40,
  },
});
