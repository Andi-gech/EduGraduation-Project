import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";

import { Feather } from "@expo/vector-icons";
import Input from "../../../Components/Input";
import Buttons from "../../../Components/Buttons";
import { useRouter } from "expo-router";

import { Picker } from "@react-native-picker/picker";
import Header from "../../../Components/Header";
import { LinearGradient } from "expo-linear-gradient";

export default function Signup() {
  const router = useRouter();

  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [year, setYear] = useState("");
  const [semister, setSemister] = useState("");
  const [Gender, setGender] = useState();

  const [department, setDepartment] = useState("");
  const [isMilitary, setIsMilitary] = useState();

  const pickerref = useRef();
  const handleSendRequest = () => {
    router.push({
      pathname: "/(Auth)/Signup/Signup_step2",
      params: {
        first_name: FirstName,
        last_name: LastName,
        gender: Gender,
        department: department,
        year: year,
        semister: semister,
        is_military: isMilitary,
      },
    });
  };

  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.9]}
      className="flex flex-1  bg-white items-center"
    >
      <View className="w-full flex flex-col  items-start  px-2">
        <Header name="Create Your Account " />

        <Text className="text-[16.52px]  my-2 text-zinc-200 font-semibold">
          (Step 1/3) Student Information
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-[90%] flex flex-col  mb-4  bg-zinc-950  border-t-[2px] border-yellow-900 rounded-[20px]  shadow-lg shadow-gray-900  "
      >
        <View className="w-full flex flex-col items-start mt-4 px-2">
          <Text className="text-white">First Name</Text>
          <View className="w-full h-[55px] flex flex-col items-start mt-4 ">
            <Input
              placeholder={"Enter First Name"}
              onchange={(e) => {
                setFirstName(e);
              }}
              value={FirstName}
            />
          </View>
        </View>
        <View className="w-full flex flex-col items-start mt-4 px-2">
          <Text className="text-white">Last Name</Text>
          <View className="w-full h-[55px] flex flex-col items-start mt-4 ">
            <Input
              placeholder={"Enter Last Name"}
              onchange={(e) => setLastName(e)}
              value={LastName}
            />
          </View>
        </View>
        <View className="w-full flex-col mt-4  flex ">
          <Text className="px-2 text-white">choose Your year/semister</Text>
          <View className="flex flex-row text-white">
            <Picker
              numberOfLines={1}
              mode="dropdown"
              itemStyle={{
                height: 50,

                color: "white",
                fontSize: 18,
              }}
              ref={pickerref}
              selectedValue={year}
              style={{
                height: 50,
                color: "white",
                marginVertical: 10,
                marginTop: 10,
                width: "80%",
              }}
              onValueChange={(itemValue) => {
                setYear(itemValue);
              }}
            >
              <Picker.Item label="First Year" value="1" />
              <Picker.Item label="Second Year" value="2" />
              <Picker.Item label="Third Year" value="3" />
              <Picker.Item label="Fourth Year" value="4" />
              <Picker.Item label="Fifth Year" value="5" />
            </Picker>

            <Picker
              numberOfLines={1}
              mode="dropdown"
              itemStyle={{
                height: 50,

                color: "white",
                fontSize: 18,
              }}
              ref={pickerref}
              selectedValue={semister}
              style={{
                height: 50,
                marginVertical: 10,
                marginTop: 10,
                color: "white",
                width: "20%",
              }}
              onValueChange={(itemValue) => {
                setSemister(itemValue);
              }}
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
            </Picker>
          </View>
        </View>

        <View className="w-full flex-col mt-4  flex ">
          <Text className="px-2 text-white">choose Your Department</Text>

          <Picker
            numberOfLines={1}
            mode="dropdown"
            itemStyle={{
              height: 50,

              color: "white",
              fontSize: 18,
            }}
            ref={pickerref}
            selectedValue={department}
            style={{
              height: 50,
              marginVertical: 10,
              marginTop: 10,
              width: "100%",
              color: "white",
            }}
            onValueChange={(itemValue) => setDepartment(itemValue)}
          >
            <Picker.Item label="Computer Science" value="Computer Science" />
            <Picker.Item label="Electrical" value="Electrical" />
            <Picker.Item label="Mechanical" value="Mechanical" />
            <Picker.Item label="Civil" value="civil" />
            <Picker.Item label="Chemical" value="Chemical" />
            <Picker.Item label="AeroNautical" value="AeroNautical" />
            <Picker.Item label="Production" value="Production" />
          </Picker>
        </View>
        <View className="w-full flex flex-row items-center mt-4 px-2">
          <Text className="text-white">Gender:</Text>
          <TouchableOpacity
            style={{
              backgroundColor: Gender === "Male" ? "gray" : "black",
            }}
            className={`flex w-[50px] border-2   bg-zinc-800 ml-5 h-[30px] rounded-l-md border-gray-900 items-center justify-center flex-row`}
            onPress={() => setGender("Male")}
          >
            <Text
              className={`${Gender === "Male" ? "text-white" : "text-white"}`}
            >
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: Gender === "Female" ? "gray" : "black" }}
            className={`flex w-[50px]  border-[1px]  border-gray-900  bg-zinc-900  h-[30px] rounded-r-md items-center justify-center flex-row`}
            onPress={() => setGender("Female")}
          >
            <Text
              className={`${Gender === "Female" ? "text-white" : "text-white"}`}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full mb-[20px] flex flex-row items-center mt-4 px-2">
          <Text className="text-white">Is Military ?</Text>
          <TouchableOpacity
            style={{
              backgroundColor: isMilitary ? "gray" : "black",
            }}
            className={`flex w-[50px] border-2   bg-slate-900 ml-5 h-[30px] rounded-l-md border-gray-900 items-center justify-center flex-row`}
            onPress={() => setIsMilitary(true)}
          >
            <Text className={`${isMilitary ? "text-white" : "text-white"}`}>
              True
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: isMilitary === false ? "gray" : "black" }}
            className={`flex w-[50px]  border-[1px]  border-gray-900   h-[30px] rounded-r-md items-center justify-center flex-row`}
            onPress={() => setIsMilitary(false)}
          >
            <Text
              className={`${
                isMilitary === false ? "text-white" : "text-white"
              }`}
            >
              False
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="w-[90%] h-[55px] flex flex-col items-start  ">
        <Buttons onPress={() => handleSendRequest()} name={"Next"} />
      </View>
    </LinearGradient>
  );
}
