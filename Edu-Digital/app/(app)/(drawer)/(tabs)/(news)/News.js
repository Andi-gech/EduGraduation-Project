import React, { Suspense, lazy } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import UseFetchPosts from "../../../../../hooks/UseFetchPosts";
import Loading from "../../../../../Components/Loading";

const Posts = lazy(() => import("../../../../../Components/Posts"));

export default function News() {
  const { data, refetch, isLoading, isFetching } = UseFetchPosts();

  const router = useRouter();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View className="flex-1 relative bg-white dark:bg-black flex items-center pt-[20px] flex-col">
      <View className="w-[99%] h-[50px] px-3 flex flex-row   items-center justify-between">
        <Text className="text-black dark:text-white  text-[20px] font-bold">
          DEC Gallery
        </Text>
        <TouchableOpacity onPress={() => router.push("/AddPost")}>
          <Ionicons
            name="add"
            size={24}
            className=" text-black dark:text-white "
          />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          className="w-full flex mb-[60px] "
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />
          }
          scrollEventThrottle={400}
        >
          <Suspense fallback={<Loading />}>
            {data?.data?.map((item) => (
              <Posts
                key={item?._id}
                content={item.content}
                id={item?._id}
                image={item.image}
                time={item.date}
                user={item?.user}
                likedBy={item?.likedBy}
              />
            ))}
          </Suspense>
          {data?.data?.length === 0 && (
            <View className="w-full  flex items-center justify-center min-h-[200px] ">
              <Text className="text-black dark:text-white">No Posts Yet</Text>
              <Text className="text-black dark:text-white">
                Pull Down For posts
              </Text>
              <View className="items-center justify-center">
                <Ionicons name="arrow-down" size={24} color="white" />
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
