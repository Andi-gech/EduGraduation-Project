import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import UseFetchCourseOffering from "../../../hooks/UseFetchCourseOfferings";
import CoursesCard from "../../../Components/CoursesCard";
import Buttons from "../../../Components/Buttons";
import Header from "../../../Components/Header";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "../../../utils/api";
import { LinearGradient } from "expo-linear-gradient";
import UseFetchMyCourse from "../../../hooks/UseFetchMyCourse";
import Loading from "../../../Components/Loading";

export default function Enroll() {
  const { data, isLoading: loading } = UseFetchCourseOffering();
  const { data: MyCourse, isLoading, error } = UseFetchMyCourse();

  const sendData = async (postdata) => {
    return await api.post(`/enrollment/enroll`, postdata);
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["Enrolls"],
    mutationFn: sendData,
    onSuccess: async (response) => {
      queryClient.invalidateQueries("enrollment");
    },
    onError: (error) => {},
  });
  const handleEnroll = (id) => {
    mutation.mutate({ course: id });
  };

  return (
    <View className="flex-1  bg-white dark:bg-black flex items-center   flex-col">
      {(isLoading || loading || mutation?.isPending) && <Loading />}
      <Header name="Enroll" />
      <ScrollView className="w-[99%]    mb-[50px]  mt-2 flex    px-3">
        {data?.data?.courses?.map((item) => {
          return (
            <View
              key={item._id}
              className="w-[70%] h-[70px] my-[2px] justify-between flex-row items-center"
            >
              <CoursesCard item={item} />
              <View className="w-[100px] h-[40px]">
                <Buttons
                  name={"Enroll"}
                  onPress={() => handleEnroll(item.course._id)}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
