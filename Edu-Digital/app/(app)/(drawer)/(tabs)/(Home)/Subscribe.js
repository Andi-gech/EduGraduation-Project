import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Header from "../../../../../Components/Header";
import chapa from "../../../../../assets/chapa.png";
import UseFetchChapaInitialize from "../../../../../hooks/UseFechChapaInitialize";
import Loading from "../../../../../Components/Loading";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import UseFetchCafeStatus from "../../../../../hooks/UseFetchCafeStatus";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
export default function Subscribe() {
  const redirecturl = Linking.createURL("app/drawer/tabs/Home/Subscribe", {
    sucess: true,
  });
  const { data, isLoading, refetch } = UseFetchChapaInitialize(redirecturl);
  const navigate = useRouter();
  const {
    data: cafestatus,
    refetch: checkstatus,
    isFetching,
  } = UseFetchCafeStatus();
  const [sucess, setsucess] = useState(false);

  useEffect(() => {
    refetch();
  }, [redirecturl]);
  useEffect(() => {
    console.log(cafestatus?.data);
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

  const Format = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const handlePayment = async () => {
    const url = data?.data?.response?.data?.checkout_url;
    console.log(url);

    console.log(redirecturl);
    if (url) {
      const result = await WebBrowser.openBrowserAsync(url);
      console.log(result);
      if (result.type === "cancel") {
        checkstatus();
      }
    } else {
      console.log("Payment URL not found");
    }
  };

  return (
    <LinearGradient
      colors={["black", "black"]}
      locations={[0.0, 0.6]}
      className="flex-1 flex items-center flex-col"
    >
      <Header name="Subscription" />
      {sucess && (
        <View className=" absolute w-full h-full z-50    flex items-center justify-center">
          <View className=" absolute top-0 w-full h-full bg-black  rounded-md flex items-center justify-center"></View>
          <LinearGradient
            colors={["black", "black"]}
            locations={[0.0, 0.6]}
            className="w-[300px] h-[300px] bg-zinc-900 rounded-md flex items-center justify-center"
          >
            <Ionicons name="checkmark-circle" size={150} color="white" />
            <Text className="text-white text-center text-[20px] font-bold">
              Sucess
            </Text>
            <View className="flex flex-row items-center mt-[100px]  justify-center">
              <Text className="text-white  text-center text-[12px] font-bold">
                redirecting to home page
              </Text>
              <ActivityIndicator size="small" color="white" />
            </View>
          </LinearGradient>
        </View>
      )}
      {data?.data && (
        <View className="flex-1 w-full flex items-center justify-start">
          <LinearGradient
            colors={["#010101", "green"]}
            locations={[0.0, 0.6]}
            className="w-[90%] mt-[50px] rounded-md bg-slate-400 flex items-center justify-center"
          >
            <Image
              source={chapa}
              className="w-[200px] h-[50px] object-scale-down"
            />
            <Text className="text-white mt-2">
              Pay Your Cafe Bill With Chapa
            </Text>

            <View className="w-full h-[100px] px-5 mt-5 rounded-md bg-opacity-40 flex items-center justify-center">
              <Text className="text-white text-[30px] font-extrabold">
                {data?.data?.price} Birr
              </Text>
            </View>
          </LinearGradient>

          <View className="w-full flex px-5 mt-5">
            <Text className="text-white text-center mt-5">
              Start Date:{" "}
              <Text className="font-bold mx-5">
                {Format(data?.data.StartDate)}
              </Text>
            </Text>
            <Text className="text-white text-center mt-5">
              End Date:{" "}
              <Text className="font-bold mx-5">
                {Format(data?.data.EndDate)}
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={handlePayment}
            className="w-[200px] mt-[100px] bg-lime-600 rounded-md py-3 flex items-center justify-center"
          >
            <Text className="text-white text-lg font-bold">Pay Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {(isLoading || isFetching) && <Loading />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
