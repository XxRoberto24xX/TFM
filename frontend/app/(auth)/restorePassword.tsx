import { Dimensions, StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

import { passwordResetEmail } from "@/services/api";
import { ApiError } from "@/types/types";

import FloatingButton from "@/components/FloatingButton";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ErrorMessage from "@/components/ErrorMessage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function RestorePassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("sdfafdf");

  const handleSendPasswordEmail = async () => {
    setLoading(true);
    setError("");

    try {
      await passwordResetEmail(email);
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
        source={require("@/assets/fondoLoginGrande.png")}
        style={styles.backgroundImage}
      />

      <ThemedText
        style={{ textAlign: "center", marginTop: 35 }}
        size="h1"
        color={Colors.textTertiary}
        weight="bold">
        Recuperacion de Cuenta
      </ThemedText>
      <ThemedText
        size="l"
        color={Colors.textTertiary}
        weight="regular">
        Enviaremos un correo de recuperación
      </ThemedText>

      <ThemedTextInput
        style={{ marginTop: 45 }}
        placeholder="Correo"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />

      {error ? (
        <ErrorMessage style={{ marginTop: 20 }}>En desarrollo</ErrorMessage>
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
          onPress={() => handleSendPasswordEmail()}
        />
      )}

      <ThemedText
        style={styles.link}
        size="s"
        color={Colors.textTertiary}
        onPress={() => {
          router.back();
        }}>
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
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.8,
  },
  link: {
    marginTop: 50,
    textDecorationLine: "underline",
  },
});
