import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import api from "../utils/api";
import { useSelector } from "react-redux";

export default function Posts({ content, image, id, time, likedBy, user }) {
  const data = useSelector((state) => state.user);
  const [liked, setLiked] = useState(likedBy.includes(data?.user));
  const [likeCount, setLikeCount] = useState(likedBy?.length);

  const mutation = useMutation({
    mutationFn: async (data) => await api.put(`/post/like/${id}`, data),
    mutationKey: ["likepost"],
    onSuccess: async (response) => {
      console.log(response.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async (data) => await api.put(`/post/unlike/${id}`, data),
    mutationKey: ["unlikepost"],
    onSuccess: async (response) => {
      console.log(response.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
      unlikeMutation.mutate();
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
      mutation.mutate();
    }
  };
  const compare_Ago_date = (date) => {
    let currentDate = new Date();
    let previousDate = new Date(date);
    let difference = currentDate.getTime() - previousDate.getTime();
    let minutes = difference / (1000 * 60);
    let hours = minutes / 60;
    let days = hours / 24;
    let weeks = days / 7;
    let months = weeks / 4;
    let years = months / 12;
    if (minutes < 60) {
      return `${Math.floor(minutes)}m ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else if (days < 7) {
      return `${Math.floor(days)}d ago`;
    } else if (weeks < 4) {
      return `${Math.floor(weeks)}w ago`;
    } else if (months < 12) {
      return `${Math.floor(months)}m ago`;
    } else {
      return `${Math.floor(years)}y ago`;
    }
  };

  const blurhash = "L8Glk-009GQ+MvxoVDD$*J+uxu9E";

  return (
    <View className="  border-t-[1px] border-b-[1px] pb-2 border-zinc-900 stroke-white z-50 rounded-lg overflow-hidden my-[20px] w-screen self-center">
      <View className="w-full h-[50px] px-2 flex flex-row items-center">
        <Image
          source={{
            uri: `http://192.168.1.6:3000/${user?.profilePic}`,
          }}
          className="w-[30px] h-[30px] rounded-full"
        ></Image>
        <Text className="text-white font-semibold ml-3">{user?.firstName}</Text>
      </View>

      {image && (
        <View className="w-full ">
          <Image
            source={{ uri: `http://192.168.1.6:3000/${image}` }}
            className="w-full h-full object-cover"
            style={{
              aspectRatio: 1,
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width,
            }}
          ></Image>
        </View>
      )}

      <View className="flex flex-row my-1 p-1">
        <TouchableOpacity
          onPress={handleLike}
          className=" flex flex-row items-center"
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={30}
            color={liked ? "red" : "white"}
          />
          <Text className="text-white text-[18px] mx-1">{likeCount}</Text>
        </TouchableOpacity>

        <View className="mx-3">
          <Ionicons name="share-outline" size={30} color="white" />
        </View>
      </View>
      <View className="px-2 flex flex-row items-center">
        <Text className="text-white text-[15px] font-semibold mr-2">
          @{user.firstName}
        </Text>
        <Text className="text-white text-md leading-6">{content}</Text>
      </View>
      <View className="px-2">
        <Text className="text-gray-300 text-[12px]  leading-6">
          #Music #Dance #Art #Fashion #Design
        </Text>
      </View>
      <View className="px-2">
        <Text className="text-gray-300 text-[12px]  leading-6">
          {compare_Ago_date(time)}
        </Text>
      </View>
    </View>
  );
}
