import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.8]}
      style={styles.container} // Apply styles
    >
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <DrawerItemList {...props} />
        </View>

        <View className="w-full flex-row items-center justify-center h-[50px]">
          <Icon name="globe" size={25} color="white" />
          <Text className="ml-4 text-white">Eng</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
          }}
        >
          <Text className="text-white">Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </LinearGradient>
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
    color: "white",
    marginBottom: 5,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomDrawerContent;
