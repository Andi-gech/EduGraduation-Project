import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { MotiView, AnimatePresence } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CoursesCard from "../../../Components/CoursesCard";
import Loading from "../../../Components/Loading";
import { useLocalSearchParams, useRouter } from "expo-router";
import UseFetchMyCourse from "../../../hooks/UseFetchMyCourse";
import Header from "../../../Components/Header";
import { useSelector } from "react-redux";


export default function Class() {
  const params = useLocalSearchParams();
  const userdata = useSelector((state) => state.userData);
  const router = useRouter();
  const { data, error, isLoading } = UseFetchMyCourse();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  if (!params) {
    return (
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#09090b", "#18181b"]
            : ["#f8fafc", "#e2e8f0"]
        }
        className="flex-1  items-center justify-center"
      >
        <Ionicons name="sad" size={64} color={accentColor} />
        <Text className="text-red-400 text-lg mt-4">{error?.message}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#09090b", "#18181b"]
          : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1 pt-[20px]"
    >
      <Header name="My Classes" accentColor={accentColor} showBack />

      <View className="flex-1 px-4">
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mt-4 p-6 rounded-2xl"
          style={{
            backgroundColor: colorScheme === "dark" ? "#18181b" : "white",
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
        >
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="school" size={20} color={accentColor} />
              <Text className="ml-2 font-semibold text-zinc-900 dark:text-zinc-100">
                Department: {userdata.userdata.department}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color={accentColor} />
              <Text className="ml-2 font-semibold text-zinc-900 dark:text-zinc-100">
                Academic Year: {userdata.userdata.yearLevel} Year
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color={accentColor} />
              <Text className="ml-2 font-semibold text-zinc-900 dark:text-zinc-100">
                Semester: {userdata.userdata.semister}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("ClassSchedule")}
            className="mt-4 flex-row items-center justify-center p-3 rounded-xl"
            style={{
              backgroundColor: accentColor,
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Ionicons name="calendar" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">View Schedule</Text>
          </TouchableOpacity>
        </MotiView>

        <Text className="text-xl font-bold mt-6 text-zinc-900 dark:text-zinc-100">
          Current Courses
        </Text>

        {data?.data ? (
          <ScrollView 
            className="mt-4 flex-1"
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            <AnimatePresence>
              {data.data.map((item, index) => (
                <MotiView
                  key={item._id}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: index * 50 }}
                >
                  <CoursesCard item={item} accentColor={accentColor} />
                </MotiView>
              ))}
            </AnimatePresence>
          </ScrollView>
        ) : (
          <Text className="text-center mt-8 text-zinc-500 dark:text-zinc-400">
            No courses enrolled yet
          </Text>
        )}

        {/* Fixed Bottom Container */}
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 bg-transparent">
          <TouchableOpacity
            onPress={() => router.push("Enroll")}
            className="w-full flex-row items-center justify-center p-3 rounded-xl mb-3"
            style={{
              backgroundColor: accentColor,
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              Enroll in New Course
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center space-x-2"
            onPress={() => router.push("Progress")}
          >
            <Ionicons name="analytics" size={20} color={accentColor} />
            <Text className="text-blue-500 dark:text-blue-400 font-medium">
              View Academic Progress
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && <Loading />}
    </LinearGradient>
  );
}