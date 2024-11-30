import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import Input from "../../../Components/Input";
import Buttons from "../../../Components/Buttons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { FontAwesome6, Entypo, Feather } from "@expo/vector-icons";

import { useMutation } from "@tanstack/react-query";

import Loading from "../../../Components/Loading";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Components/Header";
import { StatusBar } from "expo-status-bar";

export default function Signup_step2() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const params = useLocalSearchParams();

  const mutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: (data) =>
      axios.post("http://192.168.1.15:3000/auth/register", data),
    onSuccess: async (response) => {
      router.push("/(Auth)/login");
    },
    onError: (error) => {
      setError(error.response.data);
      setTimeout(() => {
        setError("");
      }, 3000);
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
      auth: {
        email: email,
        password: password,
        Role: "student",
      },
      class: {
        department: params.department,
        yearLevel: params.year,
        semister: params.semister,
      },
    };
    mutation.mutate(data);
  };

  return (
    <View className="flex relative flex-1 bg-white  dark:bg-black  items-center">
      {mutation.isPending && <Loading />}
      <Header name="Complete Account Creation " />

      <View className="w-full flex flex-col  items-start mt-4 px-2">
        <Text className="text-[16.52px]  my-2 text-orange-200">
          (Step 2/3) Auth Information
        </Text>
      </View>
      <View className="w-full flex flex-col items-start mt-4 px-2">
        <Text className=" text-black dark:text-white">Email</Text>
        <View className="w-full h-[55px] flex flex-col items-start mt-4 ">
          <Input
            placeholder={"Enter Your Email"}
            onchange={(e) => {
              setEmail(e);
            }}
            value={email}
          />
        </View>
      </View>
      <View className="w-full flex flex-col items-start mt-4 px-2">
        <Text className=" text-black dark:text-white">password</Text>
        <View className="w-full h-[55px] flex flex-col items-start mt-4 ">
          <Input
            placeholder={"Enter Your Password"}
            type={"password"}
            onchange={(e) => setPassword(e)}
            value={password}
          />
        </View>
      </View>

      <View className="w-full flex flex-row items-center mt-4 px-2">
        <Entypo name="info-with-circle" size={24} color="gray" />
        <Text className="text-[12.52px] w-[90%] mx-2 text-gray-500">
          Your Account Must Be Approved By The Department Before You Can Login
        </Text>
      </View>
      {error && <Text className="text-sm mt-[10px] text-red-300">{error}</Text>}

      <View className="w-[90%] h-[55px] flex flex-col items-start mt-[10px] ">
        <Buttons onPress={() => handleSendRequest()} name={"Register"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
