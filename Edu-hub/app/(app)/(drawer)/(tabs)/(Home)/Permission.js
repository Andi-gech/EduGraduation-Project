import {
  StyleSheet,
  Text,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import RoundButton from "../../../../../Components/RoundButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SucessPopup from "../../../../../Components/SucessPopup";
import Loading from "../../../../../Components/Loading";
import ErrorPopup from "../../../../../Components/ErrorPopup";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import api from "../../../../../utils/api";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../../../Components/Header";

export default function Permission() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [sucess, setSucess] = useState(false);
  const router = useRouter();

  const [error, setError] = useState(false);
  const [errormessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date.toISOString().split("T")[0]);
    hideDatePicker();
  };
  const mutation = useMutation({
    mutationFn: async (data) => await api.post(`/permissions/`, data),
    mutationKey: ["askpermission"],
    onSuccess: async (response) => {
      console.log(response.data);
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
      }, 2000);
    },
    onError: (error) => {
      console.log(error);
      setError(true);
      setErrorMessage(error.response.data);
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 2000);
    },
  });
  const handleSendRequest = () => {
    mutation.mutate({
      Reason: reason,
      permissionDate: date,
    });
  };
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      className="   flex-1 flex items-center duration-75 transition-all ease-in-out   flex-col"
    >
      <LinearGradient
        colors={["#010101", "#262626"]}
        locations={[0.0, 0.6]}
        className=" flex-1 flex items-center     flex-col"
      >
        <View className="relative w-full  flex flex-col px-2 py-2   items-center">
          {mutation.isPending && <Loading />}
          <SucessPopup visible={sucess} />
          <ErrorPopup message={errormessage} visible={error} />

          <Header name={"Permission"} />
          <View className="w-[95%] flex flex-col   min-h-[100px]">
            <Text className="text-white font-semibold my-2 text-[15px]">
              What is the reason for asking permission
            </Text>
            <TextInput
              placeholder="Reason"
              onChangeText={(text) => setReason(text)}
              multiline={true}
              placeholderTextColor="gray"
              numberOfLines={9}
              className="w-full   mt-2 px-2 h-[100px] bg-zinc-900 text-white rounded-[12px] "
            ></TextInput>
          </View>
          <View className="w-[95%] flex flex-col  mt-2  min-h-[100px]">
            <Text className="text-white  font-semibold my-2 text-[15px]">
              Enter Date{" "}
            </Text>
            {date ? (
              <View className="w-full flex items-center">
                <Text className="text-white  my-2 text-[15px]">{date}</Text>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={showDatePicker}
              className="w-full flex items-center"
            >
              <Text className="text-yellow-400   my-2 text-[19px]">
                Show Date Picker
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              minimumDate={new Date()}
              maximumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <TouchableOpacity
            onPress={() => handleSendRequest()}
            className="w-[150px]  flex items-center justify-center rounded-md h-[50px] bg-black"
          >
            <Text className="text-white text-center font-bold">Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("RequestHistory")}
            className="w-full flex-row mt-4  flex items-center px-3 justify-end rounded-md h-[50px] "
          >
            <Text className="text-gray-300 text-[15px] text-center ">
              Request History
            </Text>
            <Ionicons name="chevron-forward" size={12} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({});
