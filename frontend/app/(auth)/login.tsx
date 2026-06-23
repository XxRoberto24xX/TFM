import { useCallback, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import ErrorMessage from "@/components/ErrorMessage";
import FloatingButtonText from "@/components/FloatingButtonText";
import TextInputBasic from "@/components/TextInputBasic";
import ThemedText from "@/components/ThemedText";

import { login } from "@/services/api";
import { ApiError } from "@/types/types";
import { Colors } from "@/constants/colors";
import { LAYOUT } from "@/constants/values";

export default function Login() {
  /* VARIABLES */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const imageSource = require("@/assets/backgrounds/fondoLoginGrande.png");

  /* HANDLERS  */
  const onEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const onPasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const onPressForgotenPassword = useCallback(() => {
    router.push("/restorePassword");
  }, []);

  const onPressRegister = useCallback(() => {
    router.push("/register");
  }, []);

  const onPressLogin = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      await SecureStore.setItemAsync("token", response.token);
      router.replace("/home");
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Login: " + apiError.message);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={30}
      showsVerticalScrollIndicator={false}>
      <Image
        style={styles.backgroundImage}
        source={imageSource}
      />

      <ThemedText
        style={styles.title}
        size="h1"
        color={Colors.textTertiary}
        weight="bold">
        Bienvenido
      </ThemedText>
      <ThemedText
        size="l"
        color={Colors.textTertiary}
        weight="regular">
        Inicia sesión con tu cuenta
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

      <View style={styles.inlineMessagePassword}>
        <ThemedText
          style={styles.links}
          size="s"
          color={Colors.textTertiary}
          onPress={onPressForgotenPassword}>
          ¿Olvidaste la contraseña?
        </ThemedText>
        {error ? <ErrorMessage style={styles.errorMessage}>Credenciales Incorrectas</ErrorMessage> : null}
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color={Colors.primaryPink}
        />
      ) : (
        <FloatingButtonText
          style={styles.floatingButton}
          text="Iniciar Sesión"
          onPress={onPressLogin}
        />
      )}

      <View style={styles.inlineMessageCreateAccount}>
        <ThemedText
          size="s"
          color={Colors.textTertiary}
          weight="regular">
          ¿No tienes cuenta?
        </ThemedText>

        <ThemedText
          style={styles.links}
          size="s"
          color={Colors.textTertiary}
          onPress={onPressRegister}>
          Creala
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
    paddingBottom: 40,
    backgroundColor: Colors.background,
  },
  title: {
    marginTop: 35,
  },
  emailInput: {
    marginTop: 45,
  },
  passwordInput: {
    marginTop: 25,
  },
  links: {
    textDecorationLine: "underline",
  },
  errorMessage: {
    flex: 1,
  },
  backgroundImage: {
    width: LAYOUT.window.width,
    height: LAYOUT.window.width * 0.8,
  },
  inlineMessagePassword: {
    flexDirection: "row-reverse",
    width: "80%",
    marginTop: 20,
  },
  inlineMessageCreateAccount: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginTop: 50,
    gap: 5,
  },
  activityIndicator: {
    marginTop: 45,
    height: 54,
  },
  floatingButton: {
    marginTop: 45,
  },
});
