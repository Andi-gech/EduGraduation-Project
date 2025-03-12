import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Loading from "../../../Components/Loading";
import Input from "../../../Components/Input";
import Buttons from "../../../Components/Buttons";
import RoundButton from "../../../Components/RoundButton";

export default function ResetPassword2() {
  const params = useLocalSearchParams();
  const [Newpassword, setNewpassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const passwordsMatch = Newpassword === ConfirmPassword;

  const mutation = useMutation({
    mutationKey: ["changepassword"],
    mutationFn: (data) =>
      axios.post("http://192.168.1.9:3000/auth/changepassword", data, {
        headers: { Authorization: `${params.token}` },
      }),
    onSuccess: async (response) => {
      setSuccess("Password changed successfully!");
      setTimeout(() => router.replace("/(Auth)/login"), 2000);
    },
    onError: (error) => {
      setError(error.response?.data || "An error occurred");
      setTimeout(() => setError(""), 3000);
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={
          colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#4f46e5", "#0891b2"]
        }
        locations={[0.1, 0.9]}
        className="flex-1 items-center justify-center"
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        {mutation.isPending && <Loading />}

        <MotiView
          className="w-[90%] bg-white dark:bg-zinc-900 rounded-2xl p-6"
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={{
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
          }}
        >
          <RoundButton
            icon="arrowleft"
            onPress={() => navigation.goBack()}
            className="absolute top-2 left-2 z-10"
            iconColor={accentColor}
          />

          <View className="items-center mb-6">
            <MotiView
              from={{ scale: 0.8, rotate: "-20deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              transition={{ type: "spring" }}
            >
              <Ionicons name="lock-open" size={48} color={accentColor} />
            </MotiView>
            
            <Text className="text-2xl font-bold text-black dark:text-white mt-4">
              Reset Password
            </Text>
          </View>

          <MotiView className="space-y-4" from={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* New Password Input */}
            <View>
              <Text className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">
                New Password
              </Text>
              <Input
                placeholder="Enter new password"
                type="password"
                icon="lock-closed-outline"
                onchange={setNewpassword}
                value={Newpassword}
                accentColor={accentColor}
              />
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">
                Confirm Password
              </Text>
              <Input
                placeholder="Confirm password"
                type="password"
                icon="lock-closed-outline"
                onchange={setConfirmPassword}
                value={ConfirmPassword}
                accentColor={accentColor}
              />
            </View>

            {/* Password Match Indicator */}
            {ConfirmPassword && (
              <MotiView
                className="flex-row items-center p-2 rounded-lg"
                style={{
                  backgroundColor: passwordsMatch ? "#05966920" : "#dc262620",
                }}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Ionicons
                  name={passwordsMatch ? "checkmark-circle" : "close-circle"}
                  size={16}
                  color={passwordsMatch ? "#059669" : "#dc2626"}
                />
                <Text
                  className={`ml-2 text-sm ${
                    passwordsMatch ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                </Text>
              </MotiView>
            )}

            {/* Error/Success Messages */}
            {(error || success) && (
              <MotiView
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: error ? "#ef444420" : "#05966920",
                }}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Text
                  className={`text-sm text-center ${
                    error ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {error || success}
                </Text>
              </MotiView>
            )}
          </MotiView>

          <MotiView
            className="mt-6"
            from={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <Buttons
              name="Change Password"
              icon="key"
              onPress={() => {
                if (!passwordsMatch) return setError("Passwords don't match");
                mutation.mutate({ password: Newpassword });
              }}
            />
          </MotiView>
        </MotiView>
      </LinearGradient>
    </TouchableWithoutFeedback>
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