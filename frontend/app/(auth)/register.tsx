import { useCallback, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import ErrorMessage from "@/components/ErrorMessage";
import FloatingButtonText from "@/components/FloatingButtonText";
import TextInputBasic from "@/components/TextInputBasic";
import ThemedText from "@/components/ThemedText";

import { login, register } from "@/services/api";
import { ApiError } from "@/types/types";
import { Colors } from "@/constants/colors";
import { LAYOUT } from "@/constants/values";

export default function Register() {
  /* VARIABLES */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const imageSource = require("@/assets/backgrounds/fondoLoginPequeno.png");

  /* HANDLERS */
  const onEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const onPasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const onPassword2Change = useCallback((text: string) => {
    setPassword2(text);
  }, []);

  const onPressLoginRedirect = useCallback(() => {
    router.back();
  }, []);

  const onPressRegister = useCallback(async () => {
    setLoading(true);
    setError("");

    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await register(email, password);
      const response = await login(email, password);
      await SecureStore.setItemAsync("token", response.token);
      router.replace("/home");
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Register: " + apiError.message);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, password2]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={80}
      showsVerticalScrollIndicator={false}>
      <Image
        source={imageSource}
        style={styles.backgroundImage}
      />

      <ThemedText
        style={styles.title}
        size="h1"
        color={Colors.textTertiary}
        weight="bold">
        Registrarse
      </ThemedText>

      <ThemedText
        size="l"
        color={Colors.textTertiary}
        weight="regular">
        Crea tu nueva cuenta
      </ThemedText>

      <TextInputBasic
        style={styles.emailInput}
        placeholder="Correo"
        value={email}
        onChangeText={onEmailChange}
      />

      <TextInputBasic
        style={styles.passwordInput}
        placeholder="Contraseña"
        icon={true}
        hideContent={true}
        value={password}
        onChangeText={onPasswordChange}
      />

      <TextInputBasic
        style={styles.passwordInput}
        placeholder="Confirmar Contraseña"
        icon={true}
        hideContent={true}
        value={password2}
        onChangeText={onPassword2Change}
      />

      {error ? (
        <ErrorMessage style={styles.errorMessage}>{error}</ErrorMessage>
      ) : (
        <View style={styles.errorSpacer}></View>
      )}

      {loading ? (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color={Colors.primaryPink}
        />
      ) : (
        <FloatingButtonText
          style={styles.floatingButton}
          text="Crear Cuenta"
          onPress={onPressRegister}
        />
      )}

      <View style={styles.inlineMessageCreateAccount}>
        <ThemedText
          size="s"
          color={Colors.textTertiary}
          weight="regular">
          ¿Ya tienes cuenta?
        </ThemedText>
        <ThemedText
          style={styles.links}
          size="s"
          color={Colors.textTertiary}
          onPress={onPressLoginRedirect}>
          Inicia Sesión
        </ThemedText>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 30,
    backgroundColor: Colors.background,
  },
  backgroundImage: {
    width: LAYOUT.window.width,
    height: LAYOUT.window.width * 0.66,
  },
  title: {
    marginTop: 35,
  },
  emailInput: {
    marginTop: 45,
  },
  passwordInput: {
    marginTop: 20,
  },
  errorMessage: {
    marginTop: 20,
    maxWidth: "80%",
  },
  errorSpacer: {
    height: 36,
  },
  activityIndicator: {
    marginTop: 45,
    height: 54,
  },
  floatingButton: {
    marginTop: 45,
  },
  inlineMessageCreateAccount: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginTop: 50,
    gap: 5,
  },
  links: {
    textDecorationLine: "underline",
  },
});
