import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Appearance,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getSocket } from "../utils/socketService";

const CustomDrawerContent = (props) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    getSocket().disconnect();
    router.replace("/(Auth)/login");
  };

  return (
    <View className="flex-1 bg-white dark:bg-black   overflow-hidden">
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => {
            Appearance.setColorScheme(
              colorScheme === "dark" ? "light" : "dark"
            );
          }}
          className="flex-row items-center py-4 px-5 border-b border-gray-300 dark:border-gray-900"
        >
          {colorScheme === "dark" ? (
            <Feather name="sun" size={24} color="white" />
          ) : (
            <Feather name="moon" size={24} color="black" />
          )}
          <Text className="ml-3 text-base text-black dark:text-white">
            {colorScheme === "dark" ? "Light" : "Dark"} Mode
          </Text>
        </TouchableOpacity>

        <View className="mt-5">
          <DrawerItemList {...props} />
        </View>

        {/* <View className="flex-row items-center py-4 px-5 border-b border-gray-200 dark:border-gray-900">
          <Ionicons
            name="globe"
            size={25}
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="ml-3 text-base text-black dark:text-white">
            English
          </Text>
        </View> */}

        <TouchableOpacity className="py-4 px-5 " onPress={logout}>
          <Text className="text-base text-black dark:text-white">Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContent;
