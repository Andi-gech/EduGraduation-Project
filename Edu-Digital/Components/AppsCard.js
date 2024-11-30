import { Text, useColorScheme, useWindowDimensions } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function AppsCard({ name, icon, onpress }) {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  // Adjust styles based on screen width
  const cardWidth = width > 400 ? 150 : 130; // Larger width for bigger screens
  const cardHeight = width > 400 ? 80 : 80;

  return (
    <TouchableOpacity
      onPress={onpress}
      style={{
        width: cardWidth,
        height: cardHeight,
        marginTop: 20,
        borderRadius: 8,
        flexShrink: 0,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f4f4f4",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginHorizontal: 8,
      }}
    >
      <Ionicons
        name={icon}
        size={24}
        color={colorScheme === "dark" ? "white" : "black"}
      />
      <Text
        style={{
          marginTop: 8,
          color: colorScheme === "dark" ? "white" : "black",
        }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}
