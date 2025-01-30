import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Appearance,
  Image,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { MotiView } from "moti";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getSocket } from "../utils/socketService";
import { LinearGradient } from "expo-linear-gradient";

const CustomDrawerContent = (props) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    getSocket().disconnect();
    router.replace("/(Auth)/login");
  };

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#09090b", "#18181b"]
          : ["#f8fafc", "#ffffff"]
      }
      className="flex-1 pt-[20px]"
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flex: 1, paddingTop: 0 }}
      >
      
        {/* Theme Toggle */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
        >
          <TouchableOpacity
            onPress={() =>
              Appearance.setColorScheme(
                colorScheme === "dark" ? "light" : "dark"
              )
            }
            className="flex-row items-center py-4 px-6 mx-4 my-2 rounded-xl bg-white dark:bg-zinc-800"
            style={{
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            {colorScheme === "dark" ? (
              <Feather name="sun" size={24} color={accentColor} />
            ) : (
              <Feather name="moon" size={24} color={accentColor} />
            )}
            <Text className="ml-3 text-base text-zinc-900 dark:text-zinc-100">
              {colorScheme === "dark" ? "Light Theme" : "Dark Theme"}
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* Drawer Items */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 200 }}
          className="px-4"
        >
          <DrawerItemList
            {...props}
            itemStyle={{
              marginVertical: 4,
              borderRadius: 12,
              paddingHorizontal: 12,
            }}
            labelStyle={{
              color: colorScheme === "dark" ? "#fff" : "#000",
              fontSize: 16,
              marginLeft: -16,
            }}
            activeBackgroundColor={`${accentColor}20`}
            activeTintColor={accentColor}
            inactiveTintColor={colorScheme === "dark" ? "#a1a1aa" : "#71717a"}
          />
        </MotiView>

        {/* Logout Button */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mt-auto px-6 py-4"
        >
          <TouchableOpacity
            onPress={logout}
            className="flex-row items-center py-3 px-6 bg-red-500/10 rounded-xl"
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color={colorScheme === "dark" ? "#ef4444" : "#dc2626"}
            />
            <Text className="ml-3 text-red-500 dark:text-red-400 font-medium">
              Log Out
            </Text>
          </TouchableOpacity>
        </MotiView>
      </DrawerContentScrollView>
    </LinearGradient>
  );
};

export default CustomDrawerContent;