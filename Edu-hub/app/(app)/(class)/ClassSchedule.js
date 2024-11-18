import { ScrollView, Text, View } from "react-native";
import React from "react";
import RoundButton from "../../../Components/RoundButton";
import { useNavigation } from "expo-router";
import UseFetchSchedule from "../../../hooks/UseFetchSchedule";
import Loading from "../../../Components/Loading";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Components/Header";

export default function ClassSchedule() {
  const navigation = useNavigation();
  const { data, isLoading } = UseFetchSchedule();

  const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  console.log("data", data?.data["Friday"]);
  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.8]}
      className="flex-1   bg-white"
    >
      {isLoading && <Loading />}
      <Header name="Class Schedule" />
      <ScrollView className="w-full flex flex-col">
        {week.map((day) => {
          return (
            <View key={day} className="w-full mt-2">
              <View className="w-[99%] h-[50px]  border-l-4 border-red-700   ml-2 mt-2 flex  flex-row   items-center">
                <Text className="text-white text-lg  ml-3 font-bold">
                  {day}
                </Text>
              </View>
              {data?.data[day]?.map((data) => {
                return (
                  <View
                    key={data.time}
                    className="w-[80%]  h-[50px]  shadow-sm shadow-gray-800  bg-zinc-900  ml-[20px] mt-2 flex  flex-col   items-center"
                  >
                    <Text className="text-white text-lg ml-3 font-bold">
                      {data.courseName}
                    </Text>
                    <Text className="text-gray-400">{data.time}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        {}
      </ScrollView>
    </LinearGradient>
  );
}
