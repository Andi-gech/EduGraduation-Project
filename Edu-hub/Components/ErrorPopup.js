import { Modal, StyleSheet, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ErrorPopup({ visible, message }) {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <LinearGradient
        colors={["#010101", "#262626"]}
        locations={[0.0, 0.8]}
        className="w-[98%] h-[30%] self-center shadow-sm shadow-black absolute rounded-md bottom-0 flex items-center justify-center "
      >
        <Ionicons
          name="close-circle"
          size={100}
          color={"red"}
          className="text-green-400  bg-gray-300"
        />
        <Text className="text-[20px]  text-white font-bold">Erorr</Text>
        <Text className="text-[14px] text-white ">
          {message || "Something went wrong"}
        </Text>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({});
