import React, { useEffect, useRef } from "react";
import { Modal, Text, View, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";

const screenHeight = Dimensions.get("window").height;

export default function SucessPopup({ visible, message }) {
  const colorScheme = useColorScheme();
  const slideAnim = useRef(new Animated.Value(-screenHeight)).current; // Start above the screen

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.timing(slideAnim, {
        toValue: 0, // Final position (visible on top)
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: -screenHeight, // Move back above the screen
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible) return null; // Ensure Modal doesn't render when not visible

  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }], // Apply slide animation
        }}
        className="absolute top-0 w-full h-full items-center z-50"
      >
        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ["#010101", "#262626"]
              : ["#ffffff", "#ffffff"]
          }
          locations={[0.0, 0.8]}
          className="w-[95%] h-20 px-5 self-center flex-row rounded-full border border-green-200 dark:border-green-900 items-center shadow-sm shadow-black"
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={40}
            color={"green"}
            className="mx-2"
          />

          <View className="flex-1 overflow-hidden">
            <Text
              className={`text-lg font-bold ${
                colorScheme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Sucess
            </Text>
            <Text
              numberOfLines={2}
              className={`text-sm px-2 ${
                colorScheme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {message || "Sucessfully updated!!"}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
}
