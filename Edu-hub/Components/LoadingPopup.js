import { Modal, StyleSheet, ActivityIndicator, Text, View } from "react-native";
import React from "react";

export default function LoadingPopup({ visible }) {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View className="w-[98%] h-[30%] self-center bg-white shadow-sm shadow-black absolute rounded-md bottom-0 flex items-center justify-center ">
        <ActivityIndicator size="large" color="#00ff00" />
        <Text className="text-[20px]  text-green-700 font-bold">Loading</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
