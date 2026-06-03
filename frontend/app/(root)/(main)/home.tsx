import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

import FloatingButton from "@/components/FloatingButton";
import FavoriteCard from "@/components/FavoriteCard";
import { useState, useEffect } from "react";
import { ApiError, gasStation } from "@/types/types";
import { getListFavorites } from "@/services/api";

export default function Home() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<gasStation[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getListFavorites();
        setFavorites(data.gasStations);
      } catch (callError) {
        const apiError = callError as ApiError;
        console.log("Fetch Favoritos: " + apiError.message);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={favorites} // 1. Pasamos el array de datos
        keyExtractor={(item: gasStation) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 15 }}
        renderItem={({ item }) => (
          <FavoriteCard
            gasStation={item}
            onPress={() => {
              console.log("Hola buenos dias");
            }}
          />
        )}
      />
      <Text style={{ marginTop: 45 }}>home</Text>
      <FloatingButton
        style={{ marginTop: 45 }}
        text="Gas Station"
        onPress={() => router.push("/gasStation")}
      />
      <FloatingButton
        style={{ marginTop: 45 }}
        text="Rutas"
        onPress={() => router.push("/route")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.background,
  },
  flatList: {
    flexGrow: 0,
  },
});
