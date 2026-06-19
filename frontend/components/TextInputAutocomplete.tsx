import { memo, Ref, useCallback, useRef } from "react";
import { Keyboard, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import * as Crypto from "expo-crypto";

import { useGoogleAutocompleteStore } from "@/stores/useGoogleAutocompleteStore";
import { getPlaceAutocomplete } from "@/services/api";
import { AutocompleteType } from "@/types/types";
import { Colors } from "@/constants/colors";

interface Props {
  placeHolder: string;
  style?: StyleProp<ViewStyle>;
  type: AutocompleteType;
  ref?: Ref<TextInput>;
}

function TextInputAutocomplete({ placeHolder, style, type, ref }: Props) {
  const query = useGoogleAutocompleteStore((state) => (type === "origin" ? state.originQuery : state.destinyQuery));
  const sessionToken = useGoogleAutocompleteStore((state) => state.sesionToken);
  const setQuery = useGoogleAutocompleteStore((state) => state.setQuery);

  const setPredictions = useGoogleAutocompleteStore((state) => state.setPredictions);
  const setIsLoading = useGoogleAutocompleteStore((state) => state.setIsLoading);
  const setSessionToken = useGoogleAutocompleteStore((state) => state.setSessionToken);
  const setDisplayBottomSheet = useGoogleAutocompleteStore((state) => state.setDisplayBottomSheet);
  const setActiveInput = useGoogleAutocompleteStore((state) => state.setActiveInput);
  const setOrigin = useGoogleAutocompleteStore((state) => state.setOrigin);
  const setDestiny = useGoogleAutocompleteStore((state) => state.setDestiny);

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
      setQuery(type, text);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
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
    if (type === "origin") {
      setOrigin(null);
    } else {
      setDestiny(null);
    }
    setQuery(type, "");
    setPredictions([]);
    setSessionToken(null);
    setDisplayBottomSheet(false);
    Keyboard.dismiss();
  }, [setPredictions, setSessionToken]);

  return (
    <LinearGradient
      style={[styles.container, style]}
      colors={[Colors.primaryOrange, Colors.primaryPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <TextInput
        ref={ref}
        style={styles.input}
        placeholder={placeHolder}
        placeholderTextColor={Colors.textPrimary}
        cursorColor={Colors.textPrimary}
        value={query}
        onChangeText={handleTextChange}
        onFocus={() => {
          setActiveInput(type);
          setDisplayBottomSheet(true);
          if (!sessionToken) {
            console.log("añado el token");
            startNewSession();
          } else {
            console.log(sessionToken);
          }
        }}
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
}

export default memo(TextInputAutocomplete);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    width: "85%",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 400,
    overflow: "hidden",

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
    color: Colors.textPrimary,
  },
  icon: {
    marginLeft: "auto",
  },
});
