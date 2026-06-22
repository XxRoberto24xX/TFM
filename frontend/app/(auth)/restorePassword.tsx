import { useCallback, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { router } from "expo-router";

import ErrorMessage from "@/components/ErrorMessage";
import FloatingButton from "@/components/FloatingButton";
import TextInputBasic from "@/components/TextInputBasic";
import ThemedText from "@/components/ThemedText";

import { passwordResetEmail } from "@/services/api";
import { ApiError } from "@/types/types";
import { Colors } from "@/constants/colors";
import { LAYOUT } from "@/constants/values";

export default function RestorePassword() {
  /* VARIABLES */
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const imageSource = require("@/assets/backgrounds/fondoLoginGrande.png");

  /* HANDLERS */
  const onEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const onPressBackToLogin = useCallback(() => {
    router.back();
  }, []);

  const onPressSendPasswordEmail = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await passwordResetEmail(email);
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("RestorePassword: " + apiError.message);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={30}
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
        Recuperación de Cuenta
      </ThemedText>

      <ThemedText
        size="l"
        color={Colors.textTertiary}
        weight="regular">
        Enviaremos un correo de recuperación
      </ThemedText>

      <TextInputBasic
        style={styles.emailInput}
        placeholder="Correo"
        value={email}
        onChangeText={onEmailChange}
      />

      {error ? (
        <ErrorMessage style={styles.errorMessage}>En desarrollo</ErrorMessage>
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
        <FloatingButton
          style={styles.floatingButton}
          text="Enviar Correo"
          onPress={onPressSendPasswordEmail}
        />
      )}

      <ThemedText
        style={styles.link}
        size="s"
        color={Colors.textTertiary}
        onPress={onPressBackToLogin}>
        Volver al inicio de Sesión
      </ThemedText>
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
    height: LAYOUT.window.width * 0.8,
  },
  title: {
    textAlign: "center",
    marginTop: 35,
  },
  emailInput: {
    marginTop: 45,
  },
  errorMessage: {
    marginTop: 20,
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
  link: {
    marginTop: 50,
    textDecorationLine: "underline",
  },
});
