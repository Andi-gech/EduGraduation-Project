import {
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import RoundButton from "../../../../../Components/RoundButton";
import { Picker } from "@react-native-picker/picker";
import SucessPopup from "../../../../../Components/SucessPopup";
import ErrorPopup from "../../../../../Components/ErrorPopup";
import { LinearGradient } from "expo-linear-gradient";

import { useMutation } from "@tanstack/react-query";
import Loading from "../../../../../Components/Loading";
import api from "../../../../../utils/api";
import { useRouter } from "expo-router";
import Header from "../../../../../Components/Header";

export default function Complain() {
  const [selectedLanguage, setSelectedLanguage] = useState("dormitary");
  const [sucess, setSucess] = useState(false);
  const [complain, setComplain] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const pickerref = useRef();

  const mutation = useMutation({
    mutationFn: async (data) => await api.post(`/complain`, data),
    mutationKey: ["complain"],
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
      type: selectedLanguage,
      complain: complain,
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      className="flex flex-1 px-[10px]  mt-[5px]"
    >
      <LinearGradient
        colors={["#010101", "#262626"]}
        locations={[0.0, 0.6]}
        className="relative w-full h-full flex flex-col px-[10px]    items-center"
      >
        {mutation.isPending && <Loading />}
        <SucessPopup visible={sucess} />
        <ErrorPopup message={errormessage} visible={error} />

        <Header name="Tell us the issue " />
        <View className=" w-full pt-4 flex flex-col">
          <View className="w-[99%] flex-col  flex ">
            <Text className="mt-2 my-[10px] text-white font-semibold ">
              What issue are you facing
            </Text>

            <Picker
              numberOfLines={1}
              mode="dropdown"
              itemStyle={{ height: 120, color: "white" }}
              ref={pickerref}
              selectedValue={selectedLanguage}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
              }
            >
              <Picker.Item label="Dormitary Problem" value="dormitary" />
              <Picker.Item label="Class Room and Labratory " value="class" />
              <Picker.Item label="Adminstration " value="admin" />

              <Picker.Item label="Security Issue" value="security" />

              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
          <View className="w-[99%] flex-col  flex ">
            <Text className="my-[10px]  text-white font-semibold ">
              Tell us more
            </Text>
            <TextInput
              onChangeText={(text) => setComplain(text)}
              multiline
              placeholder="Tell us more"
              className="w-[99%] h-[100px] bg-zinc-900 text-white rounded-[12px] px-2 mt-2"
            />
          </View>
          <View className="w-[99%] flex-col items-center justify-center mt-7  flex ">
            <TouchableOpacity
              onPress={() => handleSendRequest()}
              className="w-[150px]  flex items-center justify-center rounded-md h-[50px] bg-black"
            >
              <Text className="text-white text-center font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
