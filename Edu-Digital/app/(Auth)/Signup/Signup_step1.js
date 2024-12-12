import {
  ScrollView,
  Text,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";
import React, { useRef, useState } from "react";

import Input from "../../../Components/Input";
import Buttons from "../../../Components/Buttons";
import { useRouter } from "expo-router";

import { Picker } from "@react-native-picker/picker";
import Header from "../../../Components/Header";

export default function Signup() {
  const router = useRouter();
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    year: "1",
    semister: "1",
    gender: "Female",
    department: "Computer Science",
    student_id: "",
    is_military: false,
  });
  const validateForm = () => {
    const newErrors = {};
    if (!form.first_name) newErrors.first_name = "First Name is required.";
    if (!form.last_name) newErrors.last_name = "Last Name is required.";
    if (!form.student_id) newErrors.student_id = "Student ID is required.";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const pickerref = useRef();
  const handleSendRequest = () => {
    if (validateForm()) {
      router.push({
        pathname: "/(Auth)/Signup/Signup_step2",
        params: form,
      });
    }
    setTimeout(() => {
      setErrors({});
    }, 5000);
  };
  const colorScheme = useColorScheme();

  return (
    <View className="flex flex-1  bg-white relative dark:bg-black items-center">
      <View className="w-full flex flex-col  items-start  px-2">
        <Header name="Create Your Account " />

        <Text className="text-[16.52px]  my-2 text-yellow-500 font-semibold">
          (Step 1/3) Student Information
        </Text>
      </View>
      <View className="absolute top-0 -right-10  w-[200px]   h-full ">
        {[...Array(16)].map((_, rowIndex) =>
          [...Array(12)].map((_, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.box,
                {
                  top: rowIndex * 50,
                  left: colIndex * 50,

                  backgroundColor:
                    (rowIndex + colIndex) % 2 === 0
                      ? `${
                          colorScheme === "dark"
                            ? "rgba(0, 0, 0, 0.8)"
                            : "rgba(224, 224, 224, 0.3)"
                        }`
                      : `${
                          colorScheme === "dark"
                            ? "rgba(93, 91, 90, 0.16)"
                            : "rgba(240, 240, 240, 0.05)"
                        }`,
                },
              ]}
            />
          ))
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-[90%] flex flex-col  mb-4  bg-white dark:bg-zinc-950   border-t-[2px] border-yellow-900 rounded-[20px]  shadow-lg shadow-gray-900  "
      >
        <View className="w-full flex flex-col items-start mt-4 px-2">
          <Text className=" text-black dark:text-white">First Name</Text>
          <View className="w-full h-[55px] flex flex-col items-start mt-4 ">
            <Input
              placeholder={"Enter First Name"}
              onchange={(e) => {
                handleInputChange("first_name", e);
              }}
              value={form.first_name}
            />
            {errors.first_name && (
              <Text className="text-red-500 text-sm">{errors.first_name}</Text>
            )}
          </View>
        </View>
        <View className="w-full flex flex-col items-start mt-4 px-2">
          <Text className=" text-black dark:text-white">Last Name</Text>
          <View className="w-full h-[55px] flex flex-col items-start mt-4 ">
            <Input
              placeholder={"Enter Last Name"}
              onchange={(e) => {
                handleInputChange("last_name", e);
              }}
              value={form.last_name}
            />
            {errors.last_name && (
              <Text className="text-red-500 text-sm">{errors.last_name}</Text>
            )}
          </View>
        </View>
        <View className="w-full flex-col mt-4  flex ">
          <Text className="px-2  text-black dark:text-white">
            choose Your year/semister
          </Text>
          <View className="flex flex-row  text-black dark:text-white">
            <Picker
              numberOfLines={1}
              mode="dropdown"
              dropdownIconColor={colorScheme === "dark" ? "white" : "black"}
              itemStyle={{
                height: 50,

                color: colorScheme === "dark" ? "white" : "black",
                fontSize: 18,
              }}
              ref={pickerref}
              selectedValue={form.year}
              style={{
                height: 50,
                color: colorScheme === "dark" ? "white" : "black",
                marginVertical: 10,
                marginTop: 10,
                width: "70%",
              }}
              onValueChange={(itemValue) => {
                handleInputChange("year", itemValue);
              }}
            >
              <Picker.Item
                style={{
                  backgroundColor: colorScheme === "dark" ? "black" : "white",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="First Year"
                value="1"
              />
              <Picker.Item
                style={{
                  backgroundColor: colorScheme === "dark" ? "black" : "white",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="Second Year"
                value="2"
              />
              <Picker.Item
                style={{
                  backgroundColor: colorScheme === "dark" ? "black" : "white",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="Third Year"
                value="3"
              />
              <Picker.Item
                style={{
                  backgroundColor: colorScheme === "dark" ? "black" : "white",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="Fourth Year"
                value="4"
              />
              <Picker.Item
                style={{
                  backgroundColor: colorScheme === "dark" ? "black" : "white",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="Fifth Year"
                value="5"
              />
            </Picker>

            <Picker
              numberOfLines={1}
              mode="dropdown"
              dropdownIconColor={colorScheme === "dark" ? "white" : "black"}
              itemStyle={{
                height: 50,

                color: colorScheme === "dark" ? "white" : "black",
                fontSize: 18,
              }}
              ref={pickerref}
              selectedValue={form.semister}
              style={{
                height: 50,
                marginVertical: 10,
                marginTop: 10,
                color: colorScheme === "dark" ? "white" : "black",
                width: "30%",
              }}
              onValueChange={(itemValue) => {
                handleInputChange("semister", itemValue);
              }}
            >
              <Picker.Item
                style={{
                  backgroundColor: colorScheme === "dark" ? "black" : "white",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="1"
                value="1"
              />
              <Picker.Item
                style={{
                  backgroundColor: colorScheme === "dark" ? "black" : "white",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="2"
                value="2"
              />
            </Picker>
          </View>
        </View>

        <View className="w-full flex-col mt-4  flex ">
          <Text className="px-2  text-black dark:text-white">
            choose Your Department
          </Text>

          <Picker
            numberOfLines={1}
            mode="dropdown"
            itemStyle={{
              height: 50,

              color: colorScheme === "dark" ? "white" : "black",
              fontSize: 18,
            }}
            ref={pickerref}
            selectedValue={form.department}
            dropdownIconColor={colorScheme === "dark" ? "white" : "black"}
            style={{
              height: 50,
              marginVertical: 10,
              marginTop: 10,
              width: "100%",
              color: colorScheme === "dark" ? "white" : "black",
            }}
            onValueChange={(itemValue) => {
              handleInputChange("department", itemValue);
            }}
          >
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Computer Science"
              value="Computer Science"
            />
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Electrical"
              value="Electrical"
            />
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Mechanical"
              value="Mechanical"
            />
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Civil"
              value="civil"
            />
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Chemical"
              value="Chemical"
            />
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="AeroNautical"
              value="AeroNautical"
            />
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Production"
              value="Production"
            />
          </Picker>
        </View>
        <View className="w-full flex flex-col items-start mt-4 px-2">
          <Text className=" text-black dark:text-white">Student ID</Text>
          <View className="w-full h-[55px] flex flex-col items-start mt-4 ">
            <Input
              placeholder={"Enter Student ID"}
              onchange={(e) => {
                handleInputChange("student_id", e);
              }}
              value={form.student_id}
            />
            {errors.student_id && (
              <Text className="text-red-500 text-sm">{errors.student_id}</Text>
            )}
          </View>
        </View>
        <View className="w-full flex flex-row items-center mt-4 px-2">
          <Text className=" text-black dark:text-white">Gender:</Text>
          <Picker
            numberOfLines={1}
            mode="dropdown"
            itemStyle={{
              height: 50,
              width: "100%",

              color: colorScheme === "dark" ? "white" : "black",
              fontSize: 18,
            }}
            ref={pickerref}
            selectedValue={form.gender}
            dropdownIconColor={colorScheme === "dark" ? "white" : "black"}
            selectionColor={colorScheme === "dark" ? "white" : "black"}
            style={{
              height: 50,

              color: colorScheme === "dark" ? "white" : "black",

              marginLeft: 10,
              width: "40%",
            }}
            onValueChange={(itemValue) => {
              handleInputChange("gender", itemValue);
            }}
          >
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Male"
              value={"Male"}
            />
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Female"
              value={"Female"}
            />
          </Picker>
        </View>
        <View className="w-full mb-[20px] flex flex-row items-center mt-4 px-2">
          <Text className=" text-black dark:text-white">Is Military ?</Text>
          <Picker
            numberOfLines={1}
            mode="dropdown"
            itemStyle={{
              height: 60,
              width: 180,

              color: colorScheme === "dark" ? "white" : "black",
              fontSize: 18,
            }}
            ref={pickerref}
            selectedValue={form.is_military}
            dropdownIconColor={colorScheme === "dark" ? "white" : "black"}
            selectionColor={colorScheme === "dark" ? "white" : "black"}
            style={{
              height: 53,

              color: colorScheme === "dark" ? "white" : "black",

              marginLeft: 10,

              width: 150,
            }}
            onValueChange={(itemValue) => {
              handleInputChange("is_military", itemValue);
            }}
          >
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Civilian"
              value={false}
            />
            <Picker.Item
              style={{
                backgroundColor: colorScheme === "dark" ? "black" : "white",
                color: colorScheme === "dark" ? "white" : "black",
              }}
              label="Military"
              value={true}
            />
          </Picker>
        </View>
      </ScrollView>
      <View className="w-[90%] h-[55px] flex flex-col items-start  ">
        <Buttons onPress={() => handleSendRequest()} name={"Next"} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  pattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    right: 0,
  },
  box: {
    position: "absolute",
    width: 50,
    height: 50,
    transform: [{ rotate: "45deg" }],
  },
});
