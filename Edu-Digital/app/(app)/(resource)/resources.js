import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";

import DownloadCard from "../../../Components/DownloadCard";

import UseFetchResource from "../../../hooks/UseFetchResource";

import Header from "../../../Components/Header";
import Loading from "../../../Components/Loading";
export default function resources() {
  const { data, isLoading } = UseFetchResource();

  return (
    <View className="flex-1 bg-white dark:bg-black flex items-center  flex-col ">
      <Header name="Resources" />
      {isLoading && <Loading />}
      <View className="w-full flex-1 flex  flex-col mb-5">
        <View className="w-full flex items-center justify-center h-[50px] fontbold flex-col mb-5">
          <Text className="text-black dark:text-white">
            4th Year Cse Resources
          </Text>
        </View>
        <View className="h-[500px]  flex items-center justify-center  w-full">
          <FlatList
            data={data?.data}
            renderItem={({ item }) => <DownloadCard item={item} />}
          />
          <View className="w-full flex flex-row    items-center justify-center px-5  bg-current h-[100px]"></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
