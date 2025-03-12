import { ScrollView, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Components/Header";
import UseFetchSchedule from "../../../hooks/UseFetchSchedule";
import Loading from "../../../Components/Loading";

export default function ClassSchedule() {
 
  const { data, isLoading } = UseFetchSchedule();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#09090b", "#18181b"]
          : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1 pt-[20px]"
    >
      <Header name="Class Schedule" accentColor={accentColor} showBack />
      
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView 
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {week.map((day, index) => (
            <View
              key={day}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 50 }}
              className="mb-4"
            >
              <LinearGradient
                colors={colorScheme === "dark" ? ["#262626", "#18181b"] : ["#ffffff", "#f8fafc"]}
                className="rounded-2xl p-4"
                style={{
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 2
                }}
              >
                <View className="flex-row items-center mb-3">
                  <Ionicons 
                    name="calendar" 
                    size={20} 
                    color={accentColor} 
                    className="mr-2"
                  />
                  <Text className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {day}
                  </Text>
                </View>

                {data?.data[day]?.length > 0 ? (
                  data.data[day].map((schedule, idx) => (
                    <View
                      key={schedule.time}
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 30 }}
                      className="mb-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            {schedule.courseName}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Ionicons 
                              name="time-outline" 
                              size={16} 
                              color={accentColor} 
                              className="mr-2"
                            />
                            <Text className="text-zinc-600 dark:text-zinc-300">
                              {schedule.Start} - {schedule.End} {`->`} {schedule.teacher}
                            </Text>
                          </View>
                        </View>
                        <Ionicons 
                          name="book" 
                          size={20} 
                          color={accentColor} 
                        />
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 items-center">
                    <Text className="text-zinc-500 dark:text-zinc-400">
                      No classes scheduled
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}