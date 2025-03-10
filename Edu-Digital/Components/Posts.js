import {
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import api from "../utils/api";
import { useSelector } from "react-redux";


export default function Posts({ content, image, id, time, likedBy, user }) {
  const data = useSelector((state) => state.userData);
  const [liked, setLiked] = useState(likedBy.includes(data.userdata._id));
  const [likeCount, setLikeCount] = useState(likedBy?.length);
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const cardBg = colorScheme === "dark" ? "#18181b" : "#ffffff";
  const textColor = colorScheme === "dark" ? "#f4f4f5" : "#18181b";
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
  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => await api.put(`/post/${liked ? 'unlike' : 'like'}/${id}`),
    onSuccess: () => {
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    },
    onError: () => {
      // Rollback on error
      setLiked(liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
    }
  });

  const handleLike = () => toggleLike();

  return (
    <View
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="mb-4 mx-4"
      style={{
        borderRadius: 16,
        backgroundColor: cardBg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      {/* User Header */}
      <View className="flex-row items-center p-4">
        <View
          from={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <Image
            source={{ uri: `https://eduapi.senaycreatives.com/${user?.profilePic}` }}
            className="w-10 h-10 rounded-full"
            cachePolicy="memory-disk"
          />
        </View>
        
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-base" style={{ color: textColor }}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-xs opacity-75" style={{ color: textColor }}>
{compare_Ago_date(time)}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      {content && (
        <Text className="px-4 pb-2 text-base leading-5" style={{ color: textColor }}>
          {content}
        </Text>
      )}

      {/* Post Image */}
      {image && (
        <View
          from={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-zinc-100 dark:bg-zinc-900"
        >
          <Image
            source={{ uri: `https://eduapi.senaycreatives.com/${image}` }}
            className="w-full aspect-square"
            contentFit="cover"
            transition={300}
          />
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity 
          onPress={handleLike}
          className="flex-row items-center mr-6"
        >
          <View
            animate={{ scale: liked ? [1, 0.8, 1.1, 1] : 1 }}
            transition={{ type: 'spring' }}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "#ef4444" : accentColor}
            />
          </View>
          <Text className="ml-2 font-medium" style={{ color: textColor }}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Ionicons
            name="chatbubble-outline"
            size={24}
            color={accentColor}
          />
          <Text className="ml-2 font-medium" style={{ color: textColor }}>
            0
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hashtags */}
      <View className="px-4 pb-4 flex-row flex-wrap">
        {["Music", "Dance", "Art", "Fashion", "Design"].map((tag) => (
          <Text 
            key={tag}
            className="mr-2 mb-1 px-2 py-1 rounded-full text-xs"
            style={{ 
              backgroundColor: `${accentColor}20`,
              color: accentColor
            }}
          >
            #{tag}
          </Text>
        ))}
      </View>
    </View>
  );
}