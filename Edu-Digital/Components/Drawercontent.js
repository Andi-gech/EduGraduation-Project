import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getSocket } from "../utils/socketService";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

const CustomDrawerContent = (props) => {
  const router = useRouter();
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    getSocket().disconnect();
    router.replace("/(Auth)/login");
  };
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1 flex justify-between relative bg-white dark:bg-black">
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <DrawerItemList {...props} />
        </View>

        <View className="w-full flex-row items-center justify-center h-[50px]">
          <Icon
            name="globe"
            size={25}
            className="text-black dark:text-white"
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="ml-4 text-black dark:text-white">Eng</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
          }}
        >
          <Text className="text-black dark:text-white">Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
  },
  drawerContent: {
    marginTop: 30,
  },
  logoutButton: {
    marginBottom: 5,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomDrawerContent;
