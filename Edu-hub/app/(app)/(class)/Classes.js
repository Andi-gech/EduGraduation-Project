import { ScrollView, TouchableHighlight, Text, View } from "react-native";
import React from "react";

import CoursesCard from "../../../Components/CoursesCard";
import Loading from "../../../Components/Loading";
import Buttons from "../../../Components/Buttons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import UseFetchMyCourse from "../../../hooks/UseFetchMyCourse";
import Header from "../../../Components/Header";
import { LinearGradient } from "expo-linear-gradient";

export default function Class() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { data, error, isLoading } = UseFetchMyCourse();

  if (!params) {
    return (
      <View className="flex-1 flex flex-col items-center justify-center ">
        <Ionicons name="sad" size={64} color="gray" />
        <Text className=" text-red-900 ">{error?.message}</Text>
      </View>
    );
  }
  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.6]}
      className="flex relative flex-1 px-[10px]"
    >
      {isLoading && <Loading />}
      <Header name="My Classes" />
      <View className="w-[99%]  mb-[20px]   flex-col  px-2 mt-2 flex justify-start">
        <View className="mt-3 w-[]  ">
          <View className="flex h-[30px]    items-center flex-row">
            <Text className="font-bold text-white ">Department:</Text>
            <Text className="ml-2  font-bold text-white">CSE</Text>
          </View>
          <View className="flex h-[30px]    items-center flex-row">
            <Text className="font-bold text-white ">Acadamic Year:</Text>
            <Text className="ml-2  font-bold text-white">
              {params.year} Year
            </Text>
          </View>
          <View className="flex h-[30px]   items-center flex-row">
            <Text className="font-bold text-white ">Acadamic Semister:</Text>
            <Text className="ml-2   font-bold text-white">
              {params.semister} Semister
            </Text>
          </View>
        </View>
        <TouchableHighlight
          onPress={() => router.push("ClassSchedule")}
          className="w-[160px] h-[50px] flex items-center justify-center rounded-md mt-1 bg-yellow-400"
        >
          <Text className="text-black">See Class Schedule</Text>
        </TouchableHighlight>
      </View>
      <View className="flex flex-row justify-between  mb-4  w-full  ">
        <Text className="text-white text-[20px] font-bold">
          Current Courses
        </Text>
      </View>

      {data?.data && (
        <ScrollView className="   flex    flex-col ">
          {data?.data?.map((item) => {
            return <CoursesCard key={item._id} item={item} />;
          })}
        </ScrollView>
      )}

      {error?.response?.data && (
        <Text className="text-red-500 text-center mt-10">
          {error?.response?.data}
        </Text>
      )}
      <View className="w-[90%] mx-auto mt-3 h-[50px]">
        <Buttons
          name={"Enroll"}
          onPress={() => {
            router.push("Enroll");
          }}
        />
      </View>

      <Text className=" text-blue-600 underline mt-[10px] mb-[30px]">
        Show All Mark Progress
      </Text>
    </LinearGradient>
  );
}
