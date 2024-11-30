import {
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";
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
      const isVerified = response.data.isVerified;
      console.log(isapproved, isVerified);

      if (isapproved && isVerified) {
        const token = response.data.token;

        await AsyncStorage.setItem("token", token);

        router.replace("/(app)/Home");
      } else {
        router.replace({
          pathname: "/(Auth)/Signup/Verification",
          params: {
            email: email,
            isapproved: isapproved,
            isVerified: isVerified,
          },
        });
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
              mutation.mutate({
                email: email,
                password: Password,
              })
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
