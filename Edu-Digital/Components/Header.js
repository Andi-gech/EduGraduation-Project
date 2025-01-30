import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RoundButton from "./RoundButton";
import { useNavigation } from "expo-router";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";

export default function Header({ name }) {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="w-full h-16 mb-4"
    >
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["rgba(9,9,11,0.8)", "rgba(24,24,27,0.9)"]
            : ["rgba(255,255,255,0.9)", "rgba(248,250,252,0.9)"]
        }
        className="flex-row items-center px-4 h-full rounded-2xl"
        style={styles.container}
      >
        <RoundButton 
          icon="arrowleft" 
          onPress={() => navigation.goBack()}
          iconColor={accentColor}
          
          size={28}
        />

        <Text 
          className="flex-1 text-center text-xl font-bold"
          style={[styles.title, { color: accentColor }]}
        >
          {name}
        </Text>

        {/* Spacer to balance the back button */}
        <View className="w-8" />
      </LinearGradient>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  }
});