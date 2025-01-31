import { Text, useColorScheme, useWindowDimensions } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function AppsCard({ name, icon, onpress,type,countDown }) {
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
      {
        type === "new" && (
          <Text
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "red",
              color: "white",
              padding: 4,
              borderRadius: 4,
            }}
          >
            New
          </Text>
        )
      }
      {
        type === "limited" && (
          <Text
            style={{
              position: "absolute",
              zIndex: 1,
              top: 2,
              right: 8,
              backgroundColor: "orange",
              color: "white",
              padding: 4,
              borderRadius: 4,
            }}
          >
            Limited
          </Text>
        )
      }
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
      {
        countDown && (
          <Text
            style={{
              position: "absolute",
              bottom: 2,
              left: 0,
              fontSize: 10,
              color: "red",
            }}
          >
            {countDown}
          </Text>
        )
      }
    </TouchableOpacity>
  );
}
