import {
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

export default function Buttons({ onPress, name }) {
  const disabled = false;
  return (
    <TouchableOpacity
      className="w-full h-full overflow-hidden"
      disabled={disabled}
      onPress={onPress}
    >
      <View
        className={` w-full h-full rounded-[12px] ${
          disabled ? "bg-zinc-500" : "bg-yellow-400"
        }  flex items-center justify-center`}
      >
        <Text className="text-black text-center font-bold">
          {disabled ? "Enrolled" : name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
