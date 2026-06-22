import { memo, Ref, useCallback, useRef } from "react";
import { Keyboard, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import * as Crypto from "expo-crypto";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

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
  /* VARIABLES */
  const INPUT_DEBOUNCE = 300;

  const query = useGoogleAutocompleteStore((state) => (type === "origin" ? state.originQuery : state.destinyQuery));

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* FUNCTIONS */
  const searchPlaces = useCallback(async (text: string) => {
    const sessionToken = useGoogleAutocompleteStore.getState().sesionToken;

    try {
      if (sessionToken !== null) {
        const data = await getPlaceAutocomplete(text, sessionToken);
        useGoogleAutocompleteStore.getState().setPredictions(data.predictions || []);
      } else {
        console.error("Input Error buscando lugares: el session token es nulo");
      }
    } catch (error) {
      console.error("Error buscando lugares:", error);
    } finally {
      useGoogleAutocompleteStore.getState().setIsLoading(false);
    }
  }, []);

  /* HANDLERS */
  const onTextChange = useCallback(
    (text: string) => {
      useGoogleAutocompleteStore.getState().setQuery(type, text);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      if (text.length < 3) {
        useGoogleAutocompleteStore.getState().setPredictions([]);
        useGoogleAutocompleteStore.getState().setIsLoading(false);
        return;
      }

      useGoogleAutocompleteStore.getState().setIsLoading(true);
      debounceTimeout.current = setTimeout(() => {
        searchPlaces(text);
      }, INPUT_DEBOUNCE);
    },
    [type, searchPlaces],
  );

  const onPressClear = useCallback(() => {
    if (type === "origin") {
      useGoogleAutocompleteStore.getState().setOrigin(null);
    } else {
      useGoogleAutocompleteStore.getState().setDestiny(null);
    }
    useGoogleAutocompleteStore.getState().setQuery(type, "");
    useGoogleAutocompleteStore.getState().setPredictions([]);
    useGoogleAutocompleteStore.getState().setSessionToken(null);
    useGoogleAutocompleteStore.getState().setDisplayBottomSheet(false);
    Keyboard.dismiss();

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  }, [type]);

  const onInputFocusGained = useCallback(() => {
    const sessionToken = useGoogleAutocompleteStore.getState().sesionToken;

    useGoogleAutocompleteStore.getState().setActiveInput(type);
    useGoogleAutocompleteStore.getState().setDisplayBottomSheet(true);
    if (!sessionToken) {
      useGoogleAutocompleteStore.getState().setSessionToken(Crypto.randomUUID());
    }
  }, [type]);

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
        onChangeText={onTextChange}
        onFocus={onInputFocusGained}
      />
      {query.length > 0 && (
        <Pressable
          style={styles.icon}
          onPress={onPressClear}>
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
