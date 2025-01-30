// RequestCard.js
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export default function RequestCard({ date, status, reason }) {
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  
  const statusConfig = {
    pending: { color: "#eab308", icon: "hourglass-half", label: "Pending" },
    approved: { color: "#16a34a", icon: "checkmark-circle", label: "Approved" },
    denied: { color: "#dc2626", icon: "close-circle", label: "Denied" }
  };

  return (
    <TouchableOpacity activeOpacity={0.9}>
      <MotiView
        className="w-full rounded-xl p-4 mb-2"
        style={{
          backgroundColor: colorScheme === "dark" ? "#18181b" : "#ffffff",
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#3f3f46" : "#e4e4e7",
        }}
        from={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <MaterialIcons
                name="date-range"
                size={18}
                color={colorScheme === "dark" ? "#a1a1aa" : "#71717a"}
              />
              <Text className="text-zinc-600 dark:text-zinc-300 text-sm ml-2">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
            
            {reason && (
              <View className="flex-row items-center">
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={colorScheme === "dark" ? "#a1a1aa" : "#71717a"}
                />
                <Text 
                  className="text-zinc-600 dark:text-zinc-300 text-sm ml-2 flex-1"
                  numberOfLines={1}
                >
                  {reason}
                </Text>
              </View>
            )}
          </View>

          <MotiView
            className="flex-row items-center px-3 py-1 rounded-full"
            style={{ backgroundColor: statusConfig[status].color + "20" }}
          >
            <FontAwesome5
              name={statusConfig[status].icon}
              size={16}
              color={statusConfig[status].color}
            />
            <Text 
              className="ml-2 text-sm"
              style={{ color: statusConfig[status].color }}
            >
              {statusConfig[status].label}
            </Text>
          </MotiView>
        </View>
      </MotiView>
    </TouchableOpacity>
  );
}