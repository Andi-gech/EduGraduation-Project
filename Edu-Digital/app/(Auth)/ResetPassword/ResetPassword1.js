
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Loading from "../../../Components/Loading";
import Input from "../../../Components/Input";
import Buttons from "../../../Components/Buttons";
import RoundButton from "../../../Components/RoundButton";

export default function ResetPassword1() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [Email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [onsend, setOnsend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const colorScheme = useColorScheme();
  const router = useRouter();
 
  const inputRefs = useRef([]);
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const handleChange = (text, index) => {
    if (text.length > 1) return; // Allow only a single digit
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to the next input if available
    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const mutation = useMutation({
    mutationKey: ["verification"],
    mutationFn: (data) =>
      axios.post(
        "http://192.168.1.8:3000/auth/VerifyEmailforPassword",
        data
      ),
    onSuccess: async (response) => {
      router.replace({
        pathname: "/(Auth)/ResetPassword/ResetPassword2",
        params: {
          token: response.data.token,
        },
      });
    },
    onError: (error) => {
      setError(error.response.data);
      setTimeout(() => {
        setError("");
      }, 3000);
    },
  });
  const resendCode = useMutation({
    mutationKey: ["resendCode"],
    mutationFn: (data) =>
      axios.post("http://192.168.1.8:3000/auth/resendCode", data),
    onSuccess: async (response) => {
      setResendCooldown(60);
      setOnsend(true);
    },
    onError: (error) => {
      setError(error.response.data);
      setTimeout(() => {
        setError("");
      }, 3000);
    },
  });
  const navigation = useNavigation();

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
        {(mutation.isPending || resendCode.isPending) && <Loading />}

        <MotiView
          className="w-[90%] bg-white dark:bg-zinc-900 rounded-2xl py-6 px-3"
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
              from={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Ionicons name="mail" size={48} color={accentColor} />
            </MotiView>
            
            <Text className="text-2xl font-bold text-black dark:text-white mt-4">
              Password Reset
            </Text>
            <Text className="text-base text-center text-zinc-600 dark:text-zinc-300">
              Enter your email to receive a verification code
            </Text>
          </View>

          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Input
              placeholder="Enter Your Email"
              icon="mail-outline"
              type="email"
              onchange={setEmail}
              value={Email}
              accentColor={accentColor}
              className="mb-4"
            />
          </MotiView>

          {onsend && (
            <MotiView
              className="mb-6"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Text className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">
                Enter verification code:
              </Text>
              <View className="flex-row justify-between">
                {code.map((digit, index) => (
                  <MotiView
                    key={index}
                    from={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 50 }}
                  >
                    <TextInput
                      className={`w-12 h-12 text-center text-lg rounded-lg mx-[2px] ${
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
              </View>
            </MotiView>
          )}

          {(error || success) && (
            <MotiView
              className="mb-4 p-3 rounded-lg"
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

          <MotiView from={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <Buttons
              name={onsend ? "Verify Code" : "Send Code"}
              icon={onsend ? "checkmark-circle" : "send"}
              onPress={() => {
                if (!onsend) {
                  resendCode.mutate({ email: Email });
                } else {
                  mutation.mutate({
                    email: Email,
                    code: code.join("")
                  });
                }
              }}
            />
          </MotiView>

          <MotiView
            className="mt-4 items-center"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TouchableOpacity
              onPress={() => resendCode.mutate({ email: Email })}
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