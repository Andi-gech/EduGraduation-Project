import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import React, { useState } from "react";
import Logo from "../../Components/Logo";
import { Feather } from "@expo/vector-icons";
import Input from "../../Components/Input";
import Buttons from "../../Components/Buttons";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../Components/Loading";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function login() {
  const router = useRouter();
  const [Password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();

  const mutation = useMutation({
    mutationFn: async (newTodo) => {
      return await axios.post(
        "https://eduapi.senaycreatives.com/auth/login",
        newTodo
      );
    },
    onSuccess: async (response) => {
      const isapproved = response.data.isapproved;

      if (isapproved) {
        const token = response.data.token;

        await AsyncStorage.setItem("token", token);

        router.replace("/(app)/Home");
      } else {
        router.replace("/(Auth)/Signup/Verification");
      }
    },
    onError: (error) => {
      setError(error.response.data);
      setTimeout(() => {
        setError("");
      }, 3000);
    },

    mutationKey: ["todos"],
  });

  return (
    <View className="relative flex-1 flex items-center bg-white dark:bg-black   flex-col">
      {mutation.isPending && <Loading />}
      <StatusBar style={colorScheme} />

      <View className="flex items-start self-end mr-[15px]  justify-between  w-[61%] flex-row    mt-[30px]   ">
        <Logo />
        <TouchableOpacity>
          <Feather name="sun" size={24} />
        </TouchableOpacity>
      </View>
      <View className="mt-[29px] flex items-center  w-[90%] pt-[30px] h-[374px]   ">
        <Text className="text-[23.52px]   text-black dark:text-white font-bold">
          Login
        </Text>
        <View className="mt-5 w-full flex items-center justify-center">
          {error && <Text className="text-red-500">{error}</Text>}
          <View className="w-[90%] h-[55px] flex items-center  ">
            <Input
              placeholder={"Email"}
              type={"email"}
              onchange={(event) => {
                setEmail(event);
              }}
              value={email}
              className="placeholder-white bg-zinc-900 "
            />
          </View>
          <View className="w-[90%] mt-[13px] h-[55px] flex items-center  ">
            <Input
              type={"password"}
              placeholder={"Password"}
              className="placeholder-white bg-zinc-900 "
              onchange={(event) => {
                setPassword(event);
              }}
              value={Password}
            />
          </View>
        </View>
        <View className="mt-[25px] w-[80%] h-[55px] flex items-center justify-center">
          <Buttons
            name={"Login"}
            onPress={() =>
              mutation.mutate({ email: email, password: Password })
            }
          />
        </View>
        <View className="mt-[25px] w-full flex items-start ml-[45px] justify-center">
          <View className="flex items-center justify-center flex-row">
            <Text className="text-[14px]    text-black dark:text-white">
              Don't have an account?
            </Text>

            <TouchableOpacity onPress={() => router.push("/(Auth)/Signup")}>
              <Text className="text-[14px]  text-orange-500">Sign Up</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-[14px] mt-2  text-black dark:text-white">
            Forget Password?
          </Text>
        </View>
      </View>
    </View>
  );
}
