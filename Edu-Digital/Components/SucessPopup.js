import React from "react";
import { Modal, Text, View, Dimensions } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SuccessPopup({ visible, message }) {
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#10b981" : "#059669";

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
                    ? ["#09090b", "#18181b"] 
                    : ["#f0fdfa", "#ecfdf5"]
                }
                className="p-6 rounded-2xl border items-center"
                style={{
                  borderColor: colorScheme === "dark" ? "#374151" : "#a7f3d0",
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 15,
                  elevation: 5
                }}
              >
                {/* Progress Bar */}
                <MotiView
                  from={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2000 }}
                  className="h-1 bg-emerald-500/30 rounded-full mb-4"
                  style={{ alignSelf: 'flex-start' }}
                />

                <Ionicons
                  name="checkmark-circle"
                  size={42}
                  color={accentColor}
                  className="mb-3"
                />

                <Text 
                  className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1"
                  style={{ letterSpacing: 0.5 }}
                >
                  Success!
                </Text>
                
                <Text
                  numberOfLines={2}
                  className="text-center text-zinc-600 dark:text-zinc-300 text-base"
                >
                  {message || "Operation completed successfully"}
                </Text>

                {/* Animated Particles */}
                <MotiView
                  from={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 100 }}
                  className="absolute -top-3 -right-3"
                >
                  <Ionicons name="sparkles" size={24} color={accentColor} />
                </MotiView>
              </LinearGradient>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </Modal>
  );
}