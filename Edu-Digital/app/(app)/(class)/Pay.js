import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {  AnimatePresence } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Header from "../../../Components/Header";
import chapa from "../../../assets/chapa.png";
import UseFetchChapaInitialize from "../../../hooks/UseFechChapaInitialize";
import Loading from "../../../Components/Loading";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import UseFetchCafeStatus from "../../../hooks/UseFetchCafeStatus";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import UseFetchEnrollInitialize from "../../../hooks/UseFechEnrollInitialize";
import UseCheckEnrollment from "../../../hooks/UseCheckEnrollment";

export default function Pay() {
  const redirecturl = Linking.createURL("app/drawer/tabs/Home/Subscribe",{
success: true,
  });
  const { data, isLoading, refetch,error } = UseFetchEnrollInitialize(redirecturl);
  const navigate = useRouter();
  const {
    data: cafestatus,
    refetch: checkstatus,
    isFetching,
  } = UseCheckEnrollment();
  const [ success, setsucess] = useState(false);
  const accentColor = colorScheme === "dark" ? "#10b981" : "#059669";
  useEffect(() => {
    refetch();
  }, [redirecturl]);
  useEffect(() => {
    if (cafestatus?.data?.status) {
      setsucess(true);
      setTimeout(() => {
        setsucess(false);
        navigate.replace("/(app)/Home");
      }, 3000);
    } else {
      refetch();
    }
  }, [cafestatus]);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const handlePayment = async () => {
    const url = data?.data?.response?.data?.checkout_url;

    if (url) {
      const result = await WebBrowser.openBrowserAsync(url);

      if (result.type === "cancel") {
        checkstatus();
      }
    } else {
      console.log("Payment URL not found");
    }
  };
  const colorScheme = useColorScheme();
  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#09090b", "#18181b"]
          : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1 pt-[20px]"
    >
      <Header name="Cafe Subscription" accentColor={accentColor} showBack />

      <AnimatePresence>
        {success && (
          <View
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 items-center justify-center bg-black/50"
          >
            <View
              from={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-80 p-8 rounded-2xl"
              style={{ backgroundColor: colorScheme === "dark" ? "#18181b" : "white" }}
            >
              <View
                animate={{ rotate: "360deg" }}
                transition={{ loop: true, duration: 2000 }}
                className="items-center"
              >
                <Ionicons name="checkmark-circle" size={80} color={accentColor} />
              </View>
              <Text className="text-2xl font-bold text-center mt-6 text-zinc-900 dark:text-zinc-100">
                Payment Successful!
              </Text>
              <View className="flex-row items-center justify-center mt-8">
                <ActivityIndicator color={accentColor} />
                <Text className="text-zinc-500 dark:text-zinc-400 ml-2">
                  Redirecting...
                </Text>
              </View>
            </View>
          </View>
        )}
      </AnimatePresence>

      {data?.data && (
        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="flex-1 px-4 pt-8"
        >
          <LinearGradient
            colors={["#059669", "#10b981"]}
            className="rounded-2xl p-6"
            style={{
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
            }}
          >
            <Image
              source={chapa}
              className="w-40 h-12 mb-6 self-center"
              contentFit="contain"
            />

            <View className="items-center mb-8">
              <Text className="text-white text-lg font-medium">
                Enrollment Subscription
              </Text>
              <Text className="text-white text-4xl font-bold mt-2">
                {data.data.price} ETB
              </Text>
            </View>

            <View className="flex-row justify-between mb-6">
              <View className="items-center">
                <Ionicons name="calendar" size={20} color="white" />
                <Text className="text-white text-sm mt-2">
                  {formatDate(data.data.StartDate)}
                </Text>
              </View>
              <View className="items-center">
                <Ionicons name="calendar" size={20} color="white" />
                <Text className="text-white text-sm mt-2">
                  {formatDate(data.data.EndDate)}
                </Text>
              </View>
            </View>

            <View
              animate={{ scale: 0.98 }}
              transition={{ loop: true, duration: 1000 }}
            >
              <TouchableOpacity
                onPress={handlePayment}
                className="w-full py-4 rounded-xl items-center"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <Text className="text-white text-lg font-semibold">
                  Proceed to Payment
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View className="mt-8 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <View className="flex-row items-center">
              <Ionicons
                name="information-circle"
                size={24}
                color={accentColor}
              />
              <Text className="text-zinc-900 dark:text-zinc-100 ml-2 text-sm">
                Secure payment processed through Chapa's official payment gateway
              </Text>
            </View>
          </View>
        </View>
      )}

      {(isLoading || isFetching) && <Loading />}
      {
        error?.response?.data && (
          <Text className="text-red-500 text-center mt-4">
            {error.response.data.message}
          </Text>
        )
      }
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});