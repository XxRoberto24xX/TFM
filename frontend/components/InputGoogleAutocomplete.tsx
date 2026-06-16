import { Keyboard, Pressable, StyleSheet } from "react-native";
import { memo, useCallback, useRef, useState } from "react";
import { Colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native-gesture-handler";
import { getPlaceAutocomplete } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";

import * as Crypto from "expo-crypto";

interface Props {
  placeHolder: string;
}

const InputGoogleAutocomplete = ({ placeHolder }: Props) => {
  const [query, setQuery] = useState("");

  const sessionToken = useGoogleAutocompleteStore((state) => state.sesionToken);

  const setPredictions = useGoogleAutocompleteStore((state) => state.setPredictions);
  const setIsLoading = useGoogleAutocompleteStore((state) => state.setIsLoading);
  const setSessionToken = useGoogleAutocompleteStore((state) => state.setSessionToken);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startNewSession = useCallback(() => {
    setSessionToken(Crypto.randomUUID());
  }, [setSessionToken]);

  const searchPlaces = useCallback(
    async (text: string) => {
      try {
        if (sessionToken !== null) {
          const data = await getPlaceAutocomplete(text, sessionToken);
          setPredictions(data.predictions || []);
        } else {
          console.error("Input Error buscando lugares: el session token es nulo");
        }
      } catch (error) {
        console.error("Error buscando lugares:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setPredictions, sessionToken],
  );

  const handleTextChange = useCallback(
    (text: string) => {
      setQuery(text);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      if (text.length === 1 && !sessionToken) {
        console.log("añado el token");
        startNewSession();
      }

      if (text.length < 3) {
        setPredictions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      debounceTimeout.current = setTimeout(() => {
        searchPlaces(text);
      }, 300);
    },
    [searchPlaces, startNewSession, setIsLoading, setPredictions, sessionToken],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setPredictions([]);
    setSessionToken(null);
    Keyboard.dismiss();
  }, [setPredictions, setSessionToken]);

  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.primaryOrange, Colors.primaryPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <TextInput
        style={styles.input}
        placeholder={placeHolder}
        placeholderTextColor={Colors.textPrimary}
        cursorColor={Colors.textPrimary}
        value={query}
        onChangeText={handleTextChange}
      />
      {query.length > 0 && (
        <Pressable
          style={styles.icon}
          onPress={handleClear}>
          <Ionicons
            name="close-circle"
            size={20}
            color={Colors.textPrimary}
          />
        </Pressable>
      )}
    </LinearGradient>
  );
};

export default memo(InputGoogleAutocomplete);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 400,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Roboto_Medium",
    color: Colors.textPrimary,
  },
  icon: {
    marginLeft: "auto",
  },
});
