import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import Header from "../../../Components/Header";
import { useSelector } from "react-redux";

export default function Connect() {
  const navigation = useNavigation();
  const data = useSelector((state) => state.userData);
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const chatOptions = [
    {
      title: "Dec (Ask) Chat",
      icon: "head-question-outline",
      navigateTo: "AskChat",
      color: "#3b82f6",
    },
    {
      title: `Year ${data?.userdata?.yearLevel} (${data?.userdata?.department}) Chat`,
      icon: "chat-outline",
      navigateTo: "ClassChat",
      color: "#10b981",
    },
  ];

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#09090b", "#18181b"]
          : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1 pt-[20px]"
    >
      <Header name="Connect" accentColor={accentColor} />
      
      <View
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        className="flex-1 items-center px-4 pt-8 space-y-4"
      >
        {chatOptions.map((option, index) => (
          <View
            key={index}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 100 }}
            className="w-full"
          >
            <TouchableOpacity
              onPress={() => navigation.navigate(option.navigateTo)}
              className="w-full h-20 rounded-2xl p-4 flex-row items-center"
              style={{
                backgroundColor: colorScheme === "dark" ? "#18181b" : "white",
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <LinearGradient
                colors={[option.color, `${option.color}dd`]}
                className="w-12 h-12 rounded-full items-center justify-center"
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color="white"
                />
              </LinearGradient>

              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {option.title}
                </Text>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {option.navigateTo === "AskChat"
                    ? "Open discussion forum"
                    : "Class specific chat"}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colorScheme === "dark" ? "#a1a1aa" : "#71717a"}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Add any specific styles if needed
});