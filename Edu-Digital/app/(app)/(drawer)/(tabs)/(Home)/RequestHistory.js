import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RequestCard from "../../../../../Components/RequestCard";
import RoundButton from "../../../../../Components/RoundButton";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../../../../Components/Header";
import UseFetchPermissions from "../../../../../hooks/UseFetchPermissions";
import Loading from "../../../../../Components/Loading";

export default function RequestHistory() {
  const { data, isLoading, isError } = UseFetchPermissions();
  console.log(data?.data, "hh");
  return (
    <View className="flex-1 flex items-center bg-white  dark:bg-black  flex-col">
      <Header name="Request History" />
      {isLoading && <Loading />}
      <View className="w-[99%]     mt-2 flex  items-center justify-center">
        {data?.data?.map((item, index) => (
          <RequestCard
            key={index}
            date={item.permissionDate}
            status={item.status}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
