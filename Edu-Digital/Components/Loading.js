import { StyleSheet, View } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Loading() {
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" 
          ? ["rgba(9,9,11,0.95)", "rgba(24,24,27,0.98)"]
          : ["rgba(255,255,255,0.95)", "rgba(248,250,252,0.98)"]
      }
      className="absolute z-50 top-0 left-0 w-screen h-screen items-center justify-center"
    >
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'timing', duration: 300 }}
        className=" rounded-2xl"
        style={{
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 15,
          elevation: 5
        }}
      >
        <LinearGradient
          colors={
            colorScheme === "dark" 
              ? ["#18181b", "#262626"] 
              : ["#ffffff", "#f8fafc"]
          }
          className="p-8 rounded-xl items-center justify-center border"
          style={{
            borderColor: colorScheme === "dark" ? "#374151" : "#e2e8f0"
          }}
        >
          {/* Rotating Spinner */}
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{ loop: true, duration: 1000 }}
          >
            <Ionicons 
              name="reload-circle" 
              size={54} 
              color={accentColor} 
            />
          </MotiView>

          {/* Pulsing Dots */}
          <View className="flex-row mt-4 space-x-2">
            {[0, 1, 2].map((index) => (
              <MotiView
                key={index}
                from={{ opacity: 0.3, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                  delay: index * 200,
                  loop: true
                }}
              >
                <View 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: accentColor }}
                />
              </MotiView>
            ))}
          </View>
        </LinearGradient>
      </MotiView>
    </LinearGradient>
  );
}