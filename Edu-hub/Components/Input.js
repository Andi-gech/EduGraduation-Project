import { TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
export default function Input({ placeholder, type, onchange, value }) {
  const [showpassword, setPassword] = useState(type === "password");
  return (
    <View className="w-full h-full relative ">
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="on"
        value={value}
        onChangeText={(e) => {
          onchange(e);
        }}
        keyboardType={type || "default"}
        secureTextEntry={showpassword}
        placeholder={placeholder}
        placeholderTextColor={"gray"}
        className="w-full  px-2 h-full  placeholder-white bg-zinc-900 rounded-[12px] "
      />
      {type === "password" && (
        <TouchableOpacity
          onPress={() => {
            setPassword(!showpassword);
          }}
          className="absolute top-0 h-full flex items-center justify-center px-3 right-0"
        >
          <Ionicons
            name={!showpassword ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
