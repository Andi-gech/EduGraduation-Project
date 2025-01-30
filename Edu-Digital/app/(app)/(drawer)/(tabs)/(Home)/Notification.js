import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../../../Components/Header";
import NotificationCard from "../../../../../Components/NotificationCard";
import UseFetchNotification from "../../../../../hooks/UseFetchNotification";
import Loading from "../../../../../Components/Loading";
import { useColorScheme } from "react-native";

const NotificationSection = ({ title, icon, items }) => {
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="mb-6"
    >
      <View className="flex-row items-center mb-4">
        <Ionicons name={icon} size={24} color={accentColor} />
        <Text className="text-xl font-bold ml-2 text-zinc-900 dark:text-zinc-100">
          {title}
        </Text>
        <View className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700 ml-3" />
      </View>

      {items.length > 0 ? (
        items.map((item, index) => (
          <MotiView
            key={item._id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 50 }}
          >
            <NotificationCard data={item} />
          </MotiView>
        ))
      ) : (
        <View className="items-center py-4 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Ionicons
            name="checkmark-circle"
            size={32}
            color={colorScheme === "dark" ? "#a1a1aa" : "#71717a"}
          />
          <Text className="text-zinc-500 dark:text-zinc-400 mt-2">
            No notifications
          </Text>
        </View>
      )}
    </MotiView>
  );
};

export default function Notification() {
  const { data, isLoading } = UseFetchNotification();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const groupedNotifications = {
    General: data?.data?.filter((item) => item.type === "General") || [],
    Announcement: data?.data?.filter((item) => item.type === "Announcment") || [],
    Notice: data?.data?.filter((item) => item.type === "Notice") || [],
  };

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#09090b", "#18181b"]
          : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1"
    >
      <Header name="Notifications" accentColor={accentColor} showBack />

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          className="px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <NotificationSection
            title="General"
            icon="notifications"
            items={groupedNotifications.General}
          />

          <NotificationSection
            title="Announcement"
            icon="megaphone"
            items={groupedNotifications.Announcement}
          />

          <NotificationSection
            title="Notice"
            icon="alert-circle"
            items={groupedNotifications.Notice}
          />
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});