import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "expo-router/build/react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

export default function CunstomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/");
  };

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[Colors.primaryOrange, Colors.primaryPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <DrawerContentScrollView {...props}>
        <Image
          style={styles.backgroundImage}
          resizeMode="contain"
          source={require("@/assets/myIcon.png")}
        />
        <DrawerItemList {...props} />
        <DrawerItem
          label={"Cerrar Sesión"}
          inactiveTintColor="rgba(255, 255, 255, 0.75)"
          activeTintColor="#ffffff"
          labelStyle={{
            fontFamily: "Roboto_Bold",
            fontSize: 16,
          }}
          icon={({ color, size }) => (
            <Ionicons
              name="log-out-outline"
              size={size}
              color={color}
            />
          )}
          onPress={() => {
            handleLogout();
          }}
        />
      </DrawerContentScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 20,
  },
  gradient: {
    flex: 1,
  },
});
