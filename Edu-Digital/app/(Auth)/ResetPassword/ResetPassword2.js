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

  const passwordsMatch = Newpassword === ConfirmPassword;

  const mutation = useMutation({
    mutationKey: ["changepassword"],
    mutationFn: (data) =>
      axios.post("http://eduapi.senaycreatives.com/auth/changepassword", data, {
        headers: {
          Authorization: `${params.token}`,
        },
      }),
    onSuccess: async (response) => {
      setSuccess(response.data);
      setTimeout(() => {
        router.replace("/(Auth)/login");
      }, 3000);
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
      <View className="relative flex-1 flex items-center justify-center bg-white dark:bg-black flex-col">
        {mutation.isPending && <Loading />}
        <View className="absolute top-[50px] left-0 w-full h-[50px]  flex items-start justify-center px-[10px]">
          <RoundButton icon={"arrowleft"} onPress={() => navigation.goBack()} />
        </View>
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
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <View className="mb-[109px] flex items-center w-[90%] pt-[30px] h-[374px]">
          <Ionicons name="lock-open" size={50} color="white" />
          <Text className="text-[23.52px] text-black dark:text-white font-bold">
            Reset Password
          </Text>

          <View className="mt-[40px] w-full flex items-center justify-center">
            {error && <Text className="text-red-500">{error}</Text>}
            {success && <Text className="text-green-500">{success}</Text>}

            {/* New Password Input */}
            <View
              className={`w-[90%] h-[55px] flex items-center rounded-md border-2 ${
                ConfirmPassword
                  ? passwordsMatch
                    ? "border-green-500"
                    : "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <Input
                placeholder={"New Password"}
                type={"password"}
                onchange={(event) => setNewpassword(event)}
                value={Newpassword}
                className="placeholder-white bg-zinc-900"
              />
            </View>

            {/* Confirm Password Input */}
            <View
              className={`w-[90%] h-[55px] rounded-md mt-4 flex items-center 
                
              `}
            >
              <Input
                placeholder={"Confirm Password"}
                type={"password"}
                onchange={(event) => setConfirmPassword(event)}
                value={ConfirmPassword}
                className="placeholder-white bg-zinc-900"
              />
            </View>
          </View>

          {/* Submit Button */}
          <View className="mt-[25px] w-[80%] h-[55px] flex items-center justify-center">
            <Buttons
              name={"Change"}
              onPress={() => {
                if (!passwordsMatch) {
                  setError("Passwords do not match");
                  return;
                }
                mutation.mutate({
                  password: Newpassword,
                });
              }}
            />
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
