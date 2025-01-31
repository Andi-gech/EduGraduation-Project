import React, { Suspense, lazy } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  useColorScheme,
} from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import UseFetchPosts from "../../../../../hooks/UseFetchPosts";

const Posts = lazy(() => import("../../../../../Components/Posts"));

const SkeletonPost = () => {
  const colorScheme = useColorScheme();
  return (
    <MotiView
      className="w-full p-4 mb-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
    >
      <View className="flex-row items-center mb-4">
        <Skeleton
          colorMode={colorScheme}
          radius="round"
          width={40}
          height={40}
        />
        <View className="ml-3">
          <Skeleton colorMode={colorScheme} width={120} height={14} />
          <Skeleton
            colorMode={colorScheme}
            width={80}
            height={12}
            className="mt-1"
          />
        </View>
      </View>
      <Skeleton colorMode={colorScheme} width="100%" height={20} />
      <Skeleton
        colorMode={colorScheme}
        width="100%"
        height={200}
        className="mt-3 rounded-xl"
      />
      <View className="flex-row justify-between mt-4">
        <Skeleton colorMode={colorScheme} width={60} height={24} radius={20} />
        <Skeleton colorMode={colorScheme} width={60} height={24} radius={20} />
      </View>
    </MotiView>
  );
};

export default function News() {
  const { data, refetch, isLoading, isFetching } = UseFetchPosts();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const gradientColors = colorScheme === "dark" 
    ? ["#09090b", "#18181b"] 
    : ["#4f46e5", "#0891b2"];
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const handleRefresh = () => refetch();

  return (
    <LinearGradient
      colors={gradientColors}
      locations={[0.1, 0.9]}
      className="flex-1"
    >
      {/* Header */}
      <MotiView
        className="w-full px-6 pt-8 pb-4"
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">DEC Gallery</Text>
          <TouchableOpacity
            onPress={() => router.push("/AddPost")}
            className="p-2 bg-white/10 rounded-full"
          >
            <Ionicons name="add" size={24} color={accentColor} />
          </TouchableOpacity>
        </View>
      </MotiView>

      {/* Content */}
      <MotiView
        className="flex-1 bg-white dark:bg-zinc-900 rounded-t-[40px] pt-6"
        from={{ translateY: 50 }}
        animate={{ translateY: 0 }}
        transition={{ type: 'spring' }}
      >
        {isLoading ? (
          <ScrollView className="w-full px-4">
            {[...Array(3)].map((_, index) => (
              <SkeletonPost key={`skeleton-${index}`} />
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            className="w-full mb-[55px] px-4"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={handleRefresh}
                tintColor={accentColor}
                colors={[accentColor]}
              />
            }
          >
            <Suspense
              fallback={
                <View className="w-full  px-4">
                  {[...Array(3)].map((_, index) => (
                    <SkeletonPost key={`skeleton-${index}`} />
                  ))}
                </View>
              }
            >
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

              {/* Empty State */}
              {data?.data?.length === 0 && (
                <MotiView
                  className="items-center justify-center min-h-[300px]"
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Ionicons
                    name="images-outline"
                    size={64}
                    color={accentColor}
                    className="mb-4"
                  />
                  <Text className="text-xl font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
                    No Posts Yet
                  </Text>
                  <Text className="text-zinc-500 dark:text-zinc-400 text-center">
                    Be the first to share something!
                  </Text>
                  <MotiView
                    className="mt-4"
                    from={{ translateY: 0 }}
                    animate={{ translateY: 10 }}
                    transition={{ loop: true, duration: 1000 }}
                  >
                    <Ionicons
                      name="arrow-down"
                      size={32}
                      color={accentColor}
                    />
                  </MotiView>
                </MotiView>
              )}
            </Suspense>
          </ScrollView>
        )}
      </MotiView>
    </LinearGradient>
  );
}