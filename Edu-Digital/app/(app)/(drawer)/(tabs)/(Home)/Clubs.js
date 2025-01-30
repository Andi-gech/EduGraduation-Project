import { ScrollView, StyleSheet, Text, View,TouchableOpacity } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../../../Components/Header";
import UseFetchClubs from "../../../../../hooks/UseFetchClubs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../../utils/api";
import { useSelector } from "react-redux";
import { useColorScheme } from "react-native";

export default function Clubs() {
  const { data } = UseFetchClubs();
  const datas = useSelector((state) => state.userData);
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (clubId) => {
      const response = await api.put(`/Social/join/${clubId}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryclient.invalidateQueries("clubs");
    },
    onError: (error) => {
      console.log(datas?.userdata?._id,data.data[0].clubMembers);
      console.log(error.response?.data || "An error occurred");
    }
  });

  const handleJoinClub = (clubId) => mutation.mutate(clubId);

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#09090b", "#18181b"]
          : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1 py-[20px]"
    >
      <Header name="Student Clubs" accentColor={accentColor} showBack />
      
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        <View className="pb-24">
          {data?.data?.map((club, index) => (
            <MotiView
              key={club._id}
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
              className="mb-6 rounded-3xl overflow-hidden"
              style={{
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
              }}
            >
              <View className="h-56">
                <Image
                  className="w-full h-full"
                  source={{ uri: club.imageUrl || "https://example.com/default-club-image.jpg" }}
                  placeholder={{ blurhash: "L8Glk-009GQ+MvxoVDD$*J+uxu9E" }}
                  transition={300}
                />
                
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  className="absolute bottom-0 left-0 right-0 h-1/2 p-4 justify-end"
                >
                  <Text className="text-2xl font-bold text-white">
                    {club.clubname}
                  </Text>
                  <Text className="text-zinc-200 mt-1" numberOfLines={2}>
                    {club.clubdescription}
                  </Text>
                </LinearGradient>

                {club.clubMembers.includes(datas?.userdata?._id) ? (
                  <View className="absolute top-4 right-4 bg-emerald-500/90 px-3 py-1 rounded-full flex-row items-center">
                    <Ionicons name="checkmark" size={16} color="white" />
                    <Text className="text-white ml-1 text-sm">Member</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleJoinClub(club._id)}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-800/90 px-4 py-2 rounded-full flex-row items-center"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                  >
                    <Ionicons name="add" size={18} color={accentColor} />
                    <Text className="text-zinc-900 dark:text-zinc-100 ml-2 font-medium">
                      Join Club
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});