import { useState } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import ErrorMessage from "@/components/ErrorMessage";
import FloatingButton from "@/components/FloatingButton";
import TextInputBasic from "@/components/TextInputBasic";
import ThemedText from "@/components/ThemedText";

import { login, register } from "@/services/api";
import { ApiError } from "@/types/types";
import { Colors } from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      await register(email, password);
      const response = await login(email, password);
      await SecureStore.setItemAsync("token", response.token).then(() => {
        router.replace("/home");
      });
    } catch (callError) {
      const apiError = callError as ApiError;
      console.log("Register: " + apiError.message);
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
        source={require("@/assets/backgrounds/fondoLoginPequeno.png")}
        style={styles.backgroundImage}
      />

      <ThemedText
        style={{ marginTop: 35 }}
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
        style={{ marginTop: 45 }}
        placeholder="Correo"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />

      <TextInputBasic
        style={{ marginTop: 20 }}
        placeholder="Contraseña"
        icon={true}
        hideContent={true}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
      />

      <TextInputBasic
        style={{ marginTop: 20 }}
        placeholder="Contraseña"
        icon={true}
        hideContent={true}
        value={password2}
        onChangeText={(text) => {
          setPassword2(text);
        }}
      />

      {error ? (
        <ErrorMessage style={{ marginTop: 20 }}>Las contraseñas no coinciden</ErrorMessage>
      ) : (
        <View style={{ height: 36 }}></View>
      )}

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 45, height: 54 }}
          size="large"
          color={Colors.primaryPink}
        />
      ) : (
        <FloatingButton
          style={{ marginTop: 45 }}
          text="Crear Cuenta"
          onPress={() => handleRegister()}
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
          style={{ textDecorationLine: "underline" }}
          size="s"
          color={Colors.textTertiary}
          onPress={() => {
            router.back();
          }}>
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
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.66,
  },
  inlineMessageCreateAccount: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginTop: 50,
    gap: 5,
  },
});
