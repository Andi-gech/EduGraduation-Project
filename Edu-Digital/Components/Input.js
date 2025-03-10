import { TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

export default function Input({ 
  placeholder, 
  type, 
  onchange, 
  value, 
  icon, 
  accentColor = "#3b82f6",
  containerStyle 
}) {
  const [showPassword, setShowPassword] = useState(type === "password");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
   
      className={`w-full h-14 ${containerStyle}`}
    >
      <LinearGradient
        colors={isFocused 
          ? [accentColor + '20', accentColor + '40'] 
          : ['transparent', 'transparent']}
        locations={[0.1, 0.9]}
        className="w-full h-full  rounded-xl p-[2px]"
      >
        <View
          className="w-full h-full bg-white/10 dark:bg-zinc-900/50 rounded-xl flex-row items-center px-4"
          animate={{ borderColor: isFocused ? accentColor : 'transparent' }}
          transition={{ type: 'timing', duration: 200 }}
          style={{ borderWidth: 1 }}
        >
          {icon && (
            <View 
              
              className="mr-3"
            >
              <Ionicons 
                name={icon} 
                size={20} 
                color={isFocused ? accentColor : 'gray'} 
              />
            </View>
          )}

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="on"
            value={value}
            keyboardType={type === 'numeric' ? 'numeric' : 'default'}
            onChangeText={onchange}
            secureTextEntry={type === 'password' && showPassword}
            placeholder={placeholder}
            placeholderTextColor={isFocused ? accentColor + 'aa' : 'gray'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 h-full text-base text-black dark:text-white font-medium"
            selectionColor={accentColor}
          />

          {type === "password" && (
            <View
              animate={{ rotate: showPassword ? '0deg' : '45deg' }}
              transition={{ type: 'spring' }}
            >
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={isFocused ? accentColor : 'gray'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}