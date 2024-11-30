import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import PendingSvg from "../../../Components/Pending";
import Buttons from "../../../Components/Buttons";
import { useLocalSearchParams } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import Input from "../../../Components/Input";
import Loading from "../../../Components/Loading";

export default function Verification() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sucess, setSucess] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const params = useLocalSearchParams();
  useEffect(() => {
    if (params?.isVerified === "true") {
      setIsVerified(true);
    }
  }, [params]);
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
      console.log("verified");
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
      console.log(error.response.data);
      setTimeout(() => {
        setError();
      }, 3000);
    },
  });
  console.log(params);
  if (!isVerified) {
    return (
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
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <View className="mb-[109px] flex items-center  w-[90%] pt-[30px] h-[374px]   ">
          <Ionicons name="mail" size={50} color="white" />
          <Text className="text-[23.52px]   text-black dark:text-white font-bold">
            Verify Your Email
          </Text>
          <Text className="text-[14px] text-black dark:text-white mt-[10px]">
            We have sent a verification code to your email{" "}
            {params.email.slice(0, 4)}****@gmail.com
          </Text>
          <View className=" mt-[40px] w-full flex items-center justify-center">
            {error && <Text className="text-red-500">{error}</Text>}
            {sucess && <Text className="text-green-500">{sucess}</Text>}
            <View className="w-[90%] h-[55px] flex items-center  ">
              <Input
                placeholder={"VerificationCode"}
                type={"number"}
                onchange={(event) => {
                  setCode(event);
                }}
                value={code}
                className="placeholder-white bg-zinc-900 "
              />
            </View>
          </View>
          <View className="mt-[25px] w-[80%] h-[55px] flex items-center justify-center">
            <Buttons
              name={"Login"}
              onPress={() =>
                mutation.mutate({
                  email: params.email,
                  code: code,
                })
              }
            />
          </View>
          <View className="mt-[25px] w-full flex items-start ml-[45px] justify-center">
            <TouchableOpacity
              onPress={() => {
                resendCode.mutate({
                  email: params.email,
                });
              }}
              disabled={resendCooldown > 0}
            >
              <Text
                style={{
                  color: resendCooldown > 0 ? "gray" : "black",
                }}
                className="text-[14px] mt-2  text-black dark:text-white"
              >
                Resend Verification Code{" "}
                {resendCooldown > 0 && `(${resendCooldown})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View className="flex-1 items-center bg-white dark:bg-black   justify-center">
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
      <View className="mt-2 w-[100px] h-[100px]">
        <PendingSvg
          className="w-[300px] text-white h-[200px]"
          width={120}
          height={120}
        />
      </View>
      <View className="flex flex-row items-center w-[80%] justify-center mt-[20px]">
        <Text className="text-[14px] mx-5 text-gray-500">
          Email Verification
        </Text>
        <Ionicons
          name="checkmark-circle"
          color={"gray"}
          className="mx-[20px] text-green-400"
          size={24}
        />
      </View>
      <View className="flex flex-row items-center w-[80%] justify-center mt-[20px]">
        <Text className="text-[14px] mx-5 text-gray-500">
          AcademicOfficer Approval
        </Text>
        <Ionicons
          name="time"
          color={"gray"}
          className="mx-[20px] text-green-400"
          size={24}
        />
      </View>

      <Text className="mt-[20px] text-zinc-400  text-[20px] ">
        Waiting For Approval...
      </Text>
      <View className="w-[200px] h-[50px] mt-[20px]">
        <Buttons
          name={"Back To Login"}
          onPress={() => {
            router.replace("/(Auth)/login");
          }}
        />
      </View>

      <View className="flex flex-row items-center w-[80%] justify-center mt-[20px]">
        <Feather name="info" size={34} color={"white"} />
        <Text className="text-[14px] text-white ml-2">
          Verification could take up to 24 hours to be approved
        </Text>
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
