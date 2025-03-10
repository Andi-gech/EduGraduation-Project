import {
  ScrollView,
  Text,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";
import React, { useRef, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";

import { StatusBar } from "expo-status-bar";
import Input from "../../../Components/Input";
import Buttons from "../../../Components/Buttons";
import Header from "../../../Components/Header";
import { useRouter } from "expo-router";

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
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const pickerref = useRef();

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

  const handleSendRequest = () => {
    if (validateForm()) {
      router.push({
        pathname: "/(Auth)/Signup/Signup_step2",
        params: form,
      });
    }
    setTimeout(() => setErrors({}), 5000);
  };

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#4f46e5", "#0891b2"]
      }
      locations={[0.1, 0.9]}
      className="flex-1 items-center pt-[20px]"
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View
        from={{ rotate: '0deg' }}
        animate={{ rotate: '5deg' }}
        transition={{ loop: true, duration: 30000 }}
        className="absolute top-0 -right-10 w-[200px] h-full"
      >
        {[...Array(4)].map((_, rowIndex) =>
          [...Array(3)].map((_, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.box,
                {
                  top: rowIndex * 50,
                  left: colIndex * 50,
                  backgroundColor: (rowIndex + colIndex) % 2 === 0 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.03)',
                },
              ]}
              from={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1500 }}
            />
          ))
        )}
      </View>
      <View className="w-full px-4 z-50">
        <Header name="Create Your Account" />
        <Text className="text-lg my-2 text-amber-400 font-semibold">
          (Step 1/3) Student Information
        </Text>
      </View>
      <View
  className="w-[90%]  bg-white dark:bg-zinc-900 rounded-2xl p-4"
  style={{ 
    maxHeight: '70%', 
    shadowColor: accentColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  }}
  from={{ opacity: 0, translateY: 20 }}
  animate={{ opacity: 1, translateY: 0 }}
>
  <ScrollView 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 20 }} // Add bottom padding
  >{[
            { label: "First Name", field: "first_name", icon: "person-outline" },
            { label: "Last Name", field: "last_name", icon: "person-outline" },
            { label: "Student ID", field: "student_id", icon: "id-card-outline" },
          ].map(({ label, field, icon }) => (
            <View key={field} className="mb-4">
              <Text className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">
                {label}
              </Text>
              <Input
                placeholder={`Enter ${label}`}
                icon={icon}
                onchange={(e) => handleInputChange(field, e)}
                value={form[field]}
                accentColor={accentColor}
              />
              {errors[field] && (
                <View
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs mt-1"
                >
                  <Text className="text-red-400">{errors[field]}</Text>
                </View>
              )}
            </View>
          ))}
<View className="w-full flex-col mt-4 flex">
            <Text className="px-2 text-black dark:text-white">
              Choose Your Year/Semester
            </Text>
            <View className="flex flex-row text-black dark:text-white">
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
                {[1, 2, 3, 4, 5].map((year) => (
                  <Picker.Item
                    key={year}
                    style={{
                      backgroundColor: colorScheme === "dark" ? "black" : "white",
                      color: colorScheme === "dark" ? "white" : "black",
                    }}
                    label={`Year ${year}`}
                    value={String(year)}
                  />
                ))}
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
                  width: "40%",
                }}
                onValueChange={(itemValue) => {
                  handleInputChange("semister", itemValue);
                }}
              >
                {[1, 2].map((sem) => (
                  <Picker.Item
                    key={sem}
                    style={{
                      backgroundColor: colorScheme === "dark" ? "black" : "white",
                      color: colorScheme === "dark" ? "white" : "black",
                    }}
                    label={`Sem ${sem}`}
                    value={String(sem)}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View className="w-full flex-col mt-4 flex">
            <Text className="px-2 text-black dark:text-white">
              Choose Your Department
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
              {departments.map((dept) => (
                <Picker.Item
                  key={dept}
                  style={{
                    backgroundColor: colorScheme === "dark" ? "black" : "white",
                    color: colorScheme === "dark" ? "white" : "black",
                  }}
                  label={dept}
                  value={dept}
                />
              ))}
            </Picker>
          </View>
          <View className="w-full flex-row items-center mt-4 px-2">
            <Text className="text-black dark:text-white">Gender:</Text>
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
                width: "60%",
              }}
              onValueChange={(itemValue) => {
                handleInputChange("gender", itemValue);
              }}
            >
              {['Male', 'Female'].map((gender) => (
                <Picker.Item
                  key={gender}
                  style={{
                    backgroundColor: colorScheme === "dark" ? "black" : "white",
                    color: colorScheme === "dark" ? "white" : "black",
                  }}
                  label={gender}
                  value={gender}
                />
              ))}
            </Picker>
          </View>
          <View className="w-full mb-[20px] flex-row items-center mt-4 px-2">
            <Text className="text-black dark:text-white">Is Military?</Text>
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
          </View>
    <View
            from={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="w-full  pb-3 h-[55px] flex-col items-center"
          >
            <Buttons onPress={handleSendRequest} name="Next" />
          </View>
        
    </LinearGradient>
  );
}

const departments =  [
  "Computer Science",
  "electronics",
  "civil",
  "Mechanical",
  "Electrical",
  "Aeronautical",
  "Production",
  "chemical",
  "Motor Vehicles"]

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    width: 50,
    height: 50,
    transform: [{ rotate: "45deg" }],
  },
});