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
  const [sucess, setSucess] = useState("");
  const [onsend, setOnsend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const inputRefs = useRef([]);

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
        "http://eduapi.senaycreatives.com/auth/VerifyEmailforPassword",
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
      axios.post("http://eduapi.senaycreatives.com/auth/resendCode", data),
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
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      className="flex flex-1 px-[10px]  mt-[5px]"
    >
      <View className="relative flex-1 flex items-center justify-center bg-white dark:bg-black   flex-col">
        {(mutation.isPending || resendCode.isPending) && <Loading />}
        <View className="absolute top-0 -right-10  w-[200px]   h-full ">
          {[...Array(16)].map((_, rowIndex) =>
            [...Array(12)].map((_, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.box,
                  {
                    top: rowIndex * 50,
                    left: colIndex * 50,

                    backgroundColor:
                      (rowIndex + colIndex) % 2 === 0
                        ? `${
                            colorScheme === "dark"
                              ? "rgba(93, 91, 90, 0.16)"
                              : "rgba(224, 224, 224, 0.3)"
                          }`
                        : `${
                            colorScheme === "dark"
                              ? "rgba(0, 0, 0, 0.8)"
                              : "rgba(240, 240, 240, 0.05)"
                          }`,
                  },
                ]}
              />
            ))
          )}
        </View>
        <View className="absolute top-[50px] left-0 w-full h-[50px]  flex items-start justify-center px-[10px]">
          <RoundButton icon={"arrowleft"} onPress={() => navigation.goBack()} />
        </View>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <View className="mb-[109px] flex items-center  w-[90%] pt-[30px] h-[374px]   ">
          <Ionicons name="mail" size={50} color="white" />
          <Text className="text-[23.52px]   text-black dark:text-white font-bold">
            Verify Your Email
          </Text>
          <Text className="text-[14px] text-black dark:text-white mt-[10px]">
            We have sent a verification code to your email{" "}
          </Text>
          <View className=" mt-[40px] w-full flex items-center justify-center">
            {error && <Text className="text-red-500">{error}</Text>}
            {sucess && <Text className="text-green-500">{sucess}</Text>}
            <View className="w-[90%] h-[55px] flex items-center  ">
              <Input
                placeholder={" Enter Your Email"}
                type={"email"}
                onchange={(event) => {
                  setEmail(event);
                }}
                value={code}
                className="placeholder-white bg-zinc-900 "
              />
            </View>
            {onsend && (
              <View className="py-3">
                <Text className="text-black dark:text-gray-300 text-[20px]">
                  Enter the verification code
                </Text>

                <View className="flex flex-row justify-between mx-auto mt-4">
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      style={{
                        color: digit ? "white" : "black",
                      }}
                      className={`w-10 h-10 flex  border-gray-300 dark:border-gray-700 border-[1px] justify-center items-center text-center rounded-md text-lg mx-1 ${
                        digit
                          ? "bg-yellow-400"
                          : colorScheme === "dark"
                          ? "bg-gray-900"
                          : "bg-gray-200"
                      }`}
                      keyboardType="numeric"
                      maxLength={1}
                      value={digit}
                      onChangeText={(text) => handleChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
          <View className="mt-[25px] w-[80%] h-[55px] flex items-center justify-center">
            <Buttons
              name={onsend ? "Verify" : "Send"}
              onPress={() => {
                if (!onsend) {
                  resendCode.mutate({
                    email: Email,
                  });
                } else {
                  let codestring = code.join("");
                  mutation.mutate({
                    email: Email,
                    code: codestring,
                  });
                }
              }}
            />
          </View>
          <View className="mt-[30px] w-full flex items-start ml-[45px] justify-center">
            <TouchableOpacity
              onPress={() => {
                resendCode.mutate({
                  email: params.email,
                });
              }}
              disabled={resendCooldown > 0}
              className="h-[40px] w-[200px] flex items-center justify-center"
            >
              <Text
                style={{
                  color:
                    resendCooldown > 0
                      ? "gray"
                      : colorScheme === "dark"
                      ? "orange"
                      : "black",
                }}
                className="text-[14px] mt-2  text-black dark:text-white"
              >
                Resend Verification Code
                {resendCooldown > 0 && `(${resendCooldown})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  pattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    right: 0,
  },
  box: {
    position: "absolute",
    width: 50,
    height: 50,
    transform: [{ rotate: "45deg" }],
  },
});
