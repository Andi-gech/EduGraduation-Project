
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../../Components/Loading";
import Buttons from "../../../Components/Buttons";
import PendingSvg from "../../../Components/Pending";

export default function Verification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const inputRefs = useRef([]);
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params?.isVerified === "true") {
      setIsVerified(true);
    }
  }, [params]);
  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);
  const mutation = useMutation({
    mutationKey: ["verification"],
    mutationFn: (data) =>
      axios.post("https://eduapi.senaycreatives.com/auth/verify", data),
    onSuccess: async (response) => {
      setIsVerified(true);
    },
    onError: (error) => {
      setError(error.response.data);
      setCode(["", "", "", "", "", ""]);
      Keyboard.dismiss();
      setTimeout(() => {
        setError("");
      }, 3000);
    },
  });
  const resendCode = useMutation({
    mutationKey: ["resendCode"],
    mutationFn: (data) =>
      axios.post("https://eduapi.senaycreatives.com/auth/resendCode", data),
    onSuccess: async (response) => {
      setSucess("Code sent successfully");
      setResendCooldown(60);
      setTimeout(() => {
        setSucess("");
      }, 3000);
    },
    onError: (error) => {
      setError("Error sending code");

      setTimeout(() => {
        setError();
      }, 3000);
    },
  });

  if (!isVerified) {
    return (
      <LinearGradient
        colors={
          colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#4f46e5", "#0891b2"]
        }
        locations={[0.1, 0.9]}
        className="flex-1 items-center justify-center"
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        {(mutation.isPending || resendCode.isPending) && <Loading />}

        <MotiView
          className="w-[90%] bg-white dark:bg-zinc-900 rounded-2xl py-6"
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={{
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
          }}
        >
          <View className="items-center mb-6">
            <MotiView
              from={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Ionicons
                name="mail"
                size={48}
                color={accentColor}
                className="mb-4"
              />
            </MotiView>
            
            <Text className="text-2xl font-bold text-black dark:text-white mb-2">
              Verify Your Email
            </Text>
            <Text className="text-base text-center text-zinc-600 dark:text-zinc-300">
              We've sent a 6-digit code to {params.email?.slice(0, 4)}****@gmail.com
            </Text>
          </View>

          <View className="items-center mb-6">
            <MotiView
              className="flex-row justify-between w-full"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {code.map((digit, index) => (
                <MotiView
                  key={index}
                  from={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 50 }}
                >
                  <TextInput
                    className={`w-12 h-12 text-center text-lg rounded-lg mx-1 ${
                      digit ? "bg-amber-400" : "bg-white/10"
                    } border border-${accentColor}/30`}
                    style={{
                      color: colorScheme === "dark" ? "white" : "black",
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                  />
                </MotiView>
              ))}
            </MotiView>

            {(error || success) && (
              <MotiView
                className="mt-4 p-3 rounded-lg"
                style={{
                  backgroundColor: error ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
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
          </View>

          <MotiView className="w-full flex items-center" from={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <Buttons
              name="Verify"
              icon="checkmark-circle"
              onPress={() => mutation.mutate({
                email: params.email,
                code: code.join("")
              })}
            />
          </MotiView>

          <MotiView
            className="mt-4 items-center"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TouchableOpacity
              onPress={() => resendCode.mutate({ email: params.email })}
              disabled={resendCooldown > 0}
            >
              <Text
                className={`text-sm ${
                  resendCooldown > 0
                    ? "text-zinc-500"
                    : "text-" + (colorScheme === "dark" ? "amber-400" : "blue-500")
                }`}
              >
                Resend Code {resendCooldown > 0 && `(${resendCooldown}s)`}
              </Text>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#4f46e5", "#0891b2"]
      }
      locations={[0.1, 0.9]}
      className="flex-1 items-center justify-center"
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      
      <MotiView
        className="w-[90%] bg-white dark:bg-zinc-900 rounded-2xl p-6"
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <View className="items-center mb-8">
          <MotiView
            from={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
            transition={{ loop: true, duration: 2000 }}
          >
            <PendingSvg width={100} height={100} fill={accentColor} />
          </MotiView>

          <Text className="text-2xl font-bold text-black dark:text-white mt-4">
            Approval Pending
          </Text>
        </View>

        <View className="space-y-4">
          {[
            { label: "Email Verification", icon: "checkmark-circle", status: "complete" },
            { label: "Academic Officer Approval", icon: "time", status: "pending" },
          ].map((item, index) => (
            <MotiView
              key={index}
              className="flex-row items-center p-3 bg-white/5 rounded-lg"
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 100 }}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={item.status === "complete" ? "#10B981" : accentColor}
                className="mr-3"
              />
              <Text className="flex-1 text-zinc-600 dark:text-zinc-300">
                {item.label}
              </Text>
            </MotiView>
          ))}
        </View>

        <MotiView className="mt-8" from={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <Buttons
            name="Back to Login"
            icon="log-in"
            onPress={() => router.replace("/(Auth)/login")}
          />
        </MotiView>

        <MotiView
          className="mt-6 flex-row items-center p-3 bg-amber-100/20 dark:bg-zinc-800 rounded-lg"
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Feather name="info" size={20} color={accentColor} />
          <Text className="ml-2 text-sm text-zinc-600 dark:text-zinc-300 flex-1">
            Verification may take up to 24 hours to complete
          </Text>
        </MotiView>
      </MotiView>
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