import { StyleSheet, TouchableHighlight } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function RoundButton({ icon, onPress, size }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      className="w-[35px] h-[35px] justify-self-start bg-zinc-900 shadow-sm shadow-zinc-700 justify-center rounded-full flex items-center  "
    >
      <AntDesign name={icon} size={size || 13} color="white" />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({});
