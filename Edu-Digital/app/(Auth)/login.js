import {
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  StyleSheet,
  Appearance
} from "react-native";
import React, { useState } from "react";
import Logo from "../../Components/Logo";
import { Feather, Ionicons } from "@expo/vector-icons";
import Input from "../../Components/Input";
import Buttons from "../../Components/Buttons";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../Components/Loading";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";


export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      return await axios.post(
        "https://eduapi.senaycreatives.com/auth/login",
        credentials
      );
    },
    onSuccess: async (response) => {
      const { isapproved, isVerified, token } = response.data;
      if (isapproved && isVerified) {
        await AsyncStorage.setItem("token", token);
        router.replace("/(app)/Home");
      } else {
        router.replace({
          pathname: "/(Auth)/Signup/Verification",
          params: { email, isapproved, isVerified },
        });
      }
    },
    onError: (error) => {
      setError(error.response?.data || "An error occurred");
      setTimeout(() => setError(""), 3000);
    },
    mutationKey: ["login"],
  });

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#4f46e5", "#0891b2"]
      }
      locations={[0.1, 0.9]}
      className="flex-1 items-center"
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <MotiView
        from={{ rotate: '0deg' }}
        animate={{ rotate: '5deg' }}
        transition={{ loop: true, duration: 30000 }}
        className="absolute top-0 -right-10 w-[200px] h-full"
      >
        {[...Array(4)].map((_, rowIndex) =>
          [...Array(3)].map((_, colIndex) => (
            <MotiView
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.box,
                {
                  top: rowIndex * 50,
                  left: colIndex * 50,
                  backgroundColor: (rowIndex + colIndex) % 2 === 0 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.03)',
                },
              ]}
              from={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1500 }}
            />
          ))
        )}
      </MotiView>

      <View className="w-full px-6 pt-12 flex-row justify-between items-center">
        <Logo />
        <TouchableOpacity
          onPress={() => Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark")}
          className="p-2 bg-white/10 rounded-full"
        >
          <Feather 
            name={colorScheme === "dark" ? "sun" : "moon"} 
            size={24} 
            color={accentColor} 
          />
        </TouchableOpacity>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="w-[90%] mt-4 bg-white/90 dark:bg-black/20 p-6 rounded-2xl"
        style={{ shadowColor: accentColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 }}
      >
        <Text className="text-3xl font-bold text-center text-black dark:text-white mb-8">
          Welcome Back
        </Text>

        {error && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-100 rounded-lg"
          >
            <Text className="text-red-600 text-center">{error}</Text>
          </MotiView>
        )}

        <Input
          icon="mail-outline"
          placeholder="Email"
          value={email}
          onchange={setEmail}
          containerStyle="mb-4"
          accentColor={accentColor}
        />

        <Input
          icon="lock-closed-outline"
          placeholder="Password"
          secureTextEntry
          type={"password"}
          value={password}
          onchange={setPassword}
          containerStyle="mb-6"
          accentColor={accentColor}
        />

        <Buttons
          name="Login"
          onPress={() => mutation.mutate({
            email: email.replace(/\s+/g, ""),
            password
          })}
          accentColor={accentColor}
          loading={mutation.isPending}
        />

        <View className="mt-6 flex-row justify-between">
          <TouchableOpacity onPress={() => router.push("/(Auth)/Signup")}>
            <Text className=" text-black dark:text-white">
              New here? <Text className="text-orange-400 font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(Auth)/ResetPassword")}>
            <Text className="text-black dark:text-white">
              Forgot Password? <Text className="text-orange-400 font-semibold">Reset</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      {mutation.isPending && <Loading />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    width: 50,
    height: 50,
    transform: [{ rotate: "45deg" }],
  },
});