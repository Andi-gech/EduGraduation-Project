// RequestHistory.js
import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import RequestCard from "../../../../../Components/RequestCard";
import Header from "../../../../../Components/Header";
import UseFetchPermissions from "../../../../../hooks/UseFetchPermissions";
import Loading from "../../../../../Components/Loading";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RequestHistory() {
  const { data, isLoading, isError, refetch } = UseFetchPermissions();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  return (
    <LinearGradient
      colors={colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#f8fafc", "#e2e8f0"]}
      className="flex-1 pt-[20px]"
    >
      <Header name="Request History" />
      
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="sad-outline" size={50} color={accentColor} />
          <Text className="text-zinc-600 dark:text-zinc-300 mt-2">
            Failed to load requests
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              tintColor={accentColor}
              refreshing={isLoading}
              onRefresh={refetch}
            />
          }
        >
          {data?.data?.map((item, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 50 }}
              className="px-4 py-2"
            >
              <RequestCard
                date={item.permissionDate}
                status={item.status}
                reason={item.reason}
              />
            </MotiView>
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}