import { FlatList, StyleSheet, RefreshControl, View, Text } from "react-native";
import React, { useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "expo-router";

import UseFetchCourseOffering from "../../../hooks/UseFetchCourseOfferings";
import CoursesCard from "../../../Components/CoursesCard";
import Buttons from "../../../Components/Buttons";
import Header from "../../../Components/Header";
import api from "../../../utils/api";
import Loading from "../../../Components/Loading";
import UseCheckEnrollment from "../../../hooks/UseCheckEnrollment";

const MemoizedCoursesCard = React.memo(CoursesCard);
const MemoizedButtons = React.memo(Buttons);

export default function Enroll() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  
  const { data, isLoading: loading, refetch } = UseFetchCourseOffering();
  const { data: Enrollment, refetch: reloading } = UseCheckEnrollment();
  
  const courses = useMemo(() => data?.data?.courses || [], [data]);
  const isEnrolled = useMemo(() => Enrollment?.data?.status, [Enrollment]);

  const mutation = useMutation({
    mutationKey: ["Enrolls"],
    mutationFn: async (postdata) => await api.post("/enrollment/enroll", postdata),
    onSuccess: () => {
      queryClient.invalidateQueries("enrollment");
      reloading();
    },
  });

  const handleEnroll = useCallback(
    (id) => mutation.mutate({ course: id }),
    [mutation]
  );

  const handleRefresh = useCallback(() => {
    refetch();
    reloading();
  }, [refetch, reloading]);

  const renderItem = useCallback(({ item }) => (
    <View className="w-[70%] h-[70px] my-[2px] justify-between flex-row items-center">
      <MemoizedCoursesCard item={item} />
      <View className="w-[100px] h-[40px]">
        <MemoizedButtons
          name="Enroll"
          onPress={() => handleEnroll(item.course._id)}
        />
      </View>
    </View>
  ), [handleEnroll]);

  const keyExtractor = useCallback((item) => item._id, []);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={loading}
      onRefresh={handleRefresh}
      colors={["#ffffff"]}
    />
  ), [loading, handleRefresh]);

  if (loading || mutation.isPending) return <Loading />;

  return (
    <View className="flex-1 pt-[20px] bg-white dark:bg-black">
      <Header name="Enroll" />
      
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={refreshControl}
        className="w-[99%] mb-[50px] mt-2 px-3"
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        ListFooterComponent={
          !isEnrolled && (
            <View className="w-full items-center justify-center p-4">
              <Text className="text-black dark:text-white text-sm mb-2">
                Enroll To Get Your Course
              </Text>
              <MemoizedButtons
                name="Pay"
                onPress={() => navigation.navigate("Pay")}
              />
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});