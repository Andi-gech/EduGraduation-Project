import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../../../../../Components/Header";
import UseFetchClubs from "../../../../../hooks/UseFetchClubs";
import { Image } from "expo-image";
import Buttons from "../../../../../Components/Buttons";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../../utils/api";
import { useSelector } from "react-redux";
export default function Clubs() {
  const { data } = UseFetchClubs();
  const datas = useSelector((state) => state.userData);

  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (clubId) => {
      console.log("Joining club with id:", clubId);
      const response = await api.put(`/Social/join/${clubId}`);
      return response.data;
    },

    onSuccess: (data) => {
      console.log("Club joined successfully:", data);
      queryclient.invalidateQueries("clubs");
    },
    onError: (error) => {
      console.error(
        "Error joining club:",
        error.response ? error.response.data : error.message
      );
    },
  });

  const handleJoinClub = (clubId) => {
    mutation.mutate(clubId);
  };
  return (
    <View className="bg-black  flex-1">
      <Header name="Join Clubs " />
      <ScrollView className="">
        <View className="flex  pb-[100px]  flex-col">
          {data?.data?.map((club) => (
            <View
              className="w-full h-[200px] flex items-center justify-center mt-4 bg-red-700"
              key={club.id}
            >
              <Image
                className="absolute top-0  left-0 w-full h-full"
                source={{
                  uri: "https://img.freepik.com/free-vector/college-university-students-illustration-classmates-different-nationalities_33099-479.jpg?t=st=1731931464~exp=1731935064~hmac=ee6296f4bcab42aa6339f4abd6731bdc01dc6af34177d518373e49159659abd2&w=740",
                }}
              />
              <View className="bg-zinc-900  opacity-90 w-full h-full absolute top-0 left-0"></View>
              <Text className="  text-[25px] text-white">{club.clubname}</Text>
              <Text className="text-white">{club.clubdescription}</Text>
              {club.clubMembers.includes(datas?.userdata?._id) ? (
                <Text className="text-white">
                  Thank you for being a member of this club
                </Text>
              ) : (
                <View className="absolute w-[100px] m-[20px] h-[40px]  bottom-0">
                  <Buttons
                    onPress={() => handleJoinClub(club._id)}
                    name={"Join "}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
