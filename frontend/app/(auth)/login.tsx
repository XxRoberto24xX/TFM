import { useState } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import ErrorMessage from "@/components/ErrorMessage";
import FloatingButton from "@/components/FloatingButton";
import ThemedTextInput from "@/components/TextInputBasic";
import ThemedText from "@/components/ThemedText";

import { login } from "@/services/api";
import { ApiError } from "@/types/types";
import { Colors } from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Login() {
  /* VARIABLES   */
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* HANDLERS  */
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      await SecureStore.setItemAsync("token", response.token).then(() => {
        router.replace("/home");
      });
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Login: " + apiError.message);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={30}
      showsVerticalScrollIndicator={false}>
      <Image
        style={styles.backgroundImage}
        source={require("@/assets/backgrounds/fondoLoginGrande.png")}
      />

      <ThemedText
        style={{ marginTop: 35 }}
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

      <ThemedTextInput
        style={{ marginTop: 45 }}
        placeholder="Correo"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />

      <ThemedTextInput
        style={{ marginTop: 25 }}
        placeholder="Contraseña"
        icon={true}
        hideContent={true}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
      />

      <View style={styles.inlineMessagePassword}>
        <ThemedText
          style={{ textDecorationLine: "underline" }}
          size="s"
          color={Colors.textTertiary}
          onPress={() => {
            router.push("/restorePassword");
          }}>
          ¿Olvidaste la contraseña?
        </ThemedText>
        {error ? <ErrorMessage style={{ flex: 1 }}>Credenciales Incorrectas</ErrorMessage> : null}
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 45, height: 54 }}
          size="large"
          color={Colors.primaryPink}
        />
      ) : (
        <FloatingButton
          style={{ marginTop: 45 }}
          text="Iniciar Sesión"
          onPress={() => handleLogin()}
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
          style={{ textDecorationLine: "underline" }}
          size="s"
          color={Colors.textTertiary}
          onPress={() => {
            router.push("/register");
          }}>
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
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.8,
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
});
