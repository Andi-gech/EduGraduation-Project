import {
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../../../Components/Header";
import SucessPopup from "../../../../../Components/SucessPopup";
import ErrorPopup from "../../../../../Components/ErrorPopup";
import Loading from "../../../../../Components/Loading";
import { useMutation } from "@tanstack/react-query";
import api from "../../../../../utils/api";

export default function Complain() {
  const [selectedType, setSelectedType] = useState("dormitary");
  const [complain, setComplain] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const [errormessage, setErrorMessage] = useState("");
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const pickerRef = useRef();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.post(`/complain`, data),
    onSuccess: () => {
      setSucess(true);
      setComplain("");
      setTimeout(() => setSucess(false), 3000);
    },
    onError: (error) => {
      setError(true);
      setErrorMessage(error.response?.data || "An error occurred");
      setTimeout(() => setError(false), 3000);
    }
  });

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" 
          ? ["#09090b", "#18181b"] 
          : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1 pt-[20px]"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-4">
          <Header name="Report an Issue" accentColor={accentColor} showBack />
          
          {isPending && <Loading />}
          <SucessPopup visible={sucess} />
          <ErrorPopup message={errormessage} visible={error} />

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="mt-6 space-y-6"
          >
            {/* Issue Type Selector */}
            <View>
              <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Select Issue Type
              </Text>
              
              <TouchableOpacity
                onPress={() => setShowPicker(!showPicker)}
                className="flex-row items-center justify-between p-4 rounded-xl"
                style={{
                  backgroundColor: colorScheme === "dark" ? "#18181b" : "white",
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                <Text className="text-zinc-900 dark:text-zinc-100">
                  {selectedType.replace(/^\w/, c => c.toUpperCase())}
                </Text>
                <Ionicons 
                  name={showPicker ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={accentColor} 
                />
              </TouchableOpacity>

              {showPicker && (
                <View className="mt-2 rounded-xl overflow-hidden">
                  <Picker
                    ref={pickerRef}
                    selectedValue={selectedType}
                    onValueChange={(value) => {
                      setSelectedType(value);
                      setShowPicker(false);
                    }}
                    dropdownIconColor={accentColor}
                    style={{
                      backgroundColor: colorScheme === "dark" ? "#262626" : "white",
                    }}
                  >
                    {[
                      { label: "Dormitory Problem", value: "dormitary" },
                      { label: "Classroom/Lab Issue", value: "class" },
                      { label: "Administration", value: "admin" },
                      { label: "Security Issue", value: "security" },
                      { label: "Other", value: "other" },
                    ].map((item, index) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                        color={colorScheme === "dark" ? "white" : "black"}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            {/* Complaint Input */}
            <View>
              <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Describe the Issue
              </Text>
              
              <MotiView
                animate={{
                  borderColor: complain ? accentColor : "#e5e7eb",
                  borderWidth: 1.5
                }}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: colorScheme === "dark" ? "#18181b" : "white",
                }}
              >
                <TextInput
                  multiline
                  placeholder="Provide detailed information..."
                  placeholderTextColor="#94a3b8"
                  className="text-zinc-900 dark:text-zinc-100 text-base h-32"
                  onChangeText={setComplain}
                />
              </MotiView>
            </View>

            {/* Submit Button */}
            <MotiView
              animate={{ scale: complain ? 1.05 : 1 }}
              transition={{ type: 'timing' }}
            >
              <TouchableOpacity
                onPress={() => mutate({ type: selectedType, complain })}
                disabled={!complain}
                className="flex-row items-center justify-center p-4 rounded-xl"
                style={{
                  backgroundColor: accentColor,
                  opacity: complain ? 1 : 0.6,
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                }}
              >
                <Ionicons name="send" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Submit Report
                </Text>
              </TouchableOpacity>
            </MotiView>
          </MotiView>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}