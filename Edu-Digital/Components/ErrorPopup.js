import React from "react";
import { Modal, Text, View, Dimensions } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";

const { width, height } = Dimensions.get("window");

export default function ErrorPopup({ visible, message }) {
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#ef4444" : "#dc2626";

  return (
    <Modal transparent visible={visible} animationType="fade">
      <AnimatePresence>
        {visible && (
          <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/30">
            <MotiView
              from={{ 
                opacity: 0,
                scale: 0.9,
                translateY: -50
              }}
              animate={{ 
                opacity: 1,
                scale: 1,
                translateY: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                translateY: 50
              }}
              transition={{ type: 'timing', duration: 300 }}
              className="w-[85%]"
            >
              <LinearGradient
                colors={
                  colorScheme === "dark" 
                    ? ["#1f1b1b", "#2b2020"] 
                    : ["#fef2f2", "#fee2e2"]
                }
                className="p-6 rounded-2xl border items-center"
                style={{
                  borderColor: colorScheme === "dark" ? "#7f1d1d" : "#fecaca",
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 15,
                  elevation: 5
                }}
              >
                {/* Animated Progress Bar */}
                <MotiView
                  from={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2000 }}
                  className="h-1 bg-red-500/30 rounded-full mb-4"
                  style={{ alignSelf: 'flex-start' }}
                />

                <MotiView
                  from={{ rotate: '0deg' }}
                  animate={{ rotate: '360deg' }}
                  transition={{ loop: true, duration: 2000 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={42}
                    color={accentColor}
                    className="mb-3"
                  />
                </MotiView>

                <Text 
                  className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1"
                  style={{ letterSpacing: 0.5 }}
                >
                  Oops! Error Occurred
                </Text>
                
                <Text
                  numberOfLines={3}
                  className="text-center text-zinc-600 dark:text-zinc-300 text-base"
                >
                  {message || "Something went wrong. Please try again."}
                </Text>

                {/* Animated Warning Triangles */}
                <MotiView
                  from={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 100 }}
                  className="absolute -top-3 -left-3"
                >
                  <Ionicons name="warning" size={20} color={accentColor} />
                </MotiView>
                <MotiView
                  from={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 200 }}
                  className="absolute -bottom-3 -right-3"
                >
                  <Ionicons name="warning" size={20} color={accentColor} />
                </MotiView>
              </LinearGradient>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </Modal>
  );
}