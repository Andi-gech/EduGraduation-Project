import { StyleSheet, TouchableHighlight } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
export default function RoundButton({ icon, onPress }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      className="w-[30px] h-[30px] bg-zinc-900 shadow-sm shadow-zinc-700 justify-center rounded-full flex items-center  "
    >
      <FontAwesome name={icon} size={25} color="white" />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({});
