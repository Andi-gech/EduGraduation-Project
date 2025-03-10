import {  LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View ,ScrollView} from "react-native";
import React, { useState } from "react";
import { useColorScheme } from "react-native";

import { Entypo, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";

import Input from "../../../Components/Input";
import Buttons from "../../../Components/Buttons";
import Loading from "../../../Components/Loading";
import Header from "../../../Components/Header";

export default function Signup_step2() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const params = useLocalSearchParams();

  const mutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: (data) =>
      axios.post("https://eduapi.senaycreatives.com/auth/register", data),
    onSuccess: async () => router.push("/(Auth)/login"),
    onError: (error) => {
      setError(error.response?.data || "An error occurred");
      setTimeout(() => setError(""), 3000);
    },
  });

  const handleSendRequest = () => {
    const data = {
      user: {
        firstName: params.first_name,
        lastName: params.last_name,
        gender: params.gender,
        studentid: params.student_id,
        isMilitary: params.is_military,
      },
      auth: { email, password, Role: "student" },
      class: {
        department: params.department,
        yearLevel: params.year,
        semister: params.semister,
      },
    };
    mutation.mutate(data);
  };

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#4f46e5", "#0891b2"]
      }
      locations={[0.1, 0.9]}
      className="flex-1 items-center pt-[20px]"
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {mutation.isPending && <Loading />}

      <View className="w-full px-4 z-50">
        <Header name="Complete Account Creation" />
        <Text className="text-lg my-2 text-amber-400 font-semibold">
          (Step 2/3) Auth Information
        </Text>
      </View>

      <View
        className="w-[90%] my-4 bg-white dark:bg-zinc-900 rounded-2xl p-4"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Email Input */}
          <View from={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <Text className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">
              Email
            </Text>
            <Input
              placeholder="Enter Your Email"
              icon="mail-outline"
              onchange={setEmail}
              value={email}
              accentColor={accentColor}
            />
          </View>

          {/* Password Input */}
          <View from={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <Text className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">
              Password
            </Text>
            <Input
              placeholder="Enter Your Password"
              type="password"
              icon="lock-closed-outline"
              onchange={setPassword}
              value={password}
              accentColor={accentColor}
            />
          </View>

          {/* Info Message */}
          <View
            className="flex-row items-center p-3 bg-amber-100/20 dark:bg-zinc-800 rounded-lg"
            from={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <Entypo name="info-with-circle" size={20} color={accentColor} />
            <Text className="text-xs ml-2 text-zinc-600 dark:text-zinc-300 flex-1">
              Your account must be approved by the department before you can login
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View
              className="mt-4 p-2 bg-red-100/30 rounded-lg"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Text className="text-red-400 text-sm text-center">{error}</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Register Button */}
      <View
        className="w-[100%] flex items-center mb-4"
        from={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <Buttons
          onPress={handleSendRequest}
          name="Register"
          icon="person-add-outline"
          disabled={mutation.isPending}
        />
      </View>
    </LinearGradient>
  );
}