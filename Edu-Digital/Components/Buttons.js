import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Buttons({ onPress, name, icon, disabled = false }) {
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const gradientColors = disabled 
    ? ["#6b7280", "#4b5563"] 
    : colorScheme === "dark" 
      ? ["#f59e0b", "#d97706"] 
      : ["#3b82f6", "#2563eb"];

  return (
    <MotiView
      className="w-[90%] my-2"
      from={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring' }}
    >
      <TouchableOpacity
        className="w-full h-[50px] overflow-hidden rounded-xl"
        disabled={disabled}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: disabled ? 1 : 0.98 }}
          transition={{ type: 'timing', duration: 100 }}
          className="w-full h-full"
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full flex-row items-center justify-center space-x-2 px-4"
            style={{
              shadowColor: disabled ? "#000" : accentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            {icon && (
              <Ionicons
                name={icon}
                size={20}
                color={colorScheme === "dark" ? "#fff" : "#fff"}
              />
            )}
            <Text className="text-white text-lg font-bold tracking-wide">
              {disabled ? "Enrolled" : name}
            </Text>
          </LinearGradient>
        </MotiView>
      </TouchableOpacity>
    </MotiView>
  );
}