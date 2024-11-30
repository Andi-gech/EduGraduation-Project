import { Modal, StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SucessPopup({ visible }) {
  const colorScheme = useColorScheme();
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <LinearGradient
        colors={
          colorScheme === "dark" ? ["#010101", "#262626"] : ["white", "white"]
        }
        locations={[0.0, 0.8]}
        className="w-[98%] h-[30%] self-center bg-white border-zinc-200 dark:border-zinc-900 border-[3px] shadow-sm shadow-black absolute rounded-md bottom-0 flex items-center justify-center "
      >
        <Ionicons
          name="checkmark-circle-outline"
          size={100}
          color={"green"}
          className="text-green-400  bg-gray-300"
        />
        <Text className="text-[20px]  text-black dark:text-white font-bold">
          Sucess
        </Text>
        <Text className="text-[14px] text-black dark:text-white ">
          Your request has been sent
        </Text>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({});
