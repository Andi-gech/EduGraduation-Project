import {
  StyleSheet,
  Text,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { MotiView, AnimatePresence } from "moti";
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
import { useColorScheme } from "nativewind";

export default function Permission() {
  const { colorScheme } = useColorScheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errormessage, setErrorMessage] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const navigation = useNavigation();
  const router = useRouter();

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setDate(date.toISOString().split("T")[0]);
    hideDatePicker();
  };

  const mutation = useMutation({
    mutationFn: async (data) => await api.post(`/permissions/`, data),
    mutationKey: ["askpermission"],
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    },
    onError: (error) => {
      setError(true);
      setErrorMessage(error.response?.data || "An error occurred");
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 2000);
    },
  });

  const handleSendRequest = () => {
    mutation.mutate({ Reason: reason, permissionDate: date });
  };

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 px-4 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <Header name="Permission" accentColor={accentColor} />

          {/* Success/Error Indicators */}
          <AnimatePresence>
            {success && (
              <MotiView
                from={{ translateY: -50, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                exit={{ translateY: -50, opacity: 0 }}
                className="absolute top-4 w-full z-50"
              >
                <SucessPopup visible={success} />
              </MotiView>
            )}
          </AnimatePresence>

          <ErrorPopup message={errormessage} visible={error} />

          {/* Main Content */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg"
            style={{
              shadowColor: accentColor,
              shadowOpacity: 0.1,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            {/* Reason Input */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                Reason for Permission
              </Text>
              <MotiView
                animate={{
                  borderColor: isFocused
                    ? accentColor
                    : colorScheme === "dark"
                    ? "#374151"
                    : "#e5e7eb",
                }}
                className="rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800"
              >
                <TextInput
                  placeholder="Explain your reason..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  className="w-full text-zinc-900 dark:text-zinc-100 text-base p-4 min-h-[120px]"
                  onChangeText={setReason}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </MotiView>
            </View>

            {/* Date Picker */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                Select Date
              </Text>
              
              <TouchableOpacity
                onPress={showDatePicker}
                className="flex-row items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4"
              >
                <Text
                  className={`text-base ${
                    date ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"
                  }`}
                >
                  {date || "Choose a date"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={accentColor}
                />
              </TouchableOpacity>

              <DateTimePickerModal
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                accentColor={accentColor}
              />
            </View>

            {/* Submit Button */}
            <MotiView
              animate={{ scale: mutation.isPending ? 0.95 : 1 }}
              transition={{ type: "timing" }}
            >
              <TouchableOpacity
                onPress={handleSendRequest}
                disabled={mutation.isPending}
                className="bg-zinc-800 dark:bg-zinc-700 rounded-xl p-4 items-center justify-center flex-row"
                style={{
                  backgroundColor: accentColor,
                  shadowColor: accentColor,
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                {mutation.isPending ? (
                  <Loading color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    Submit Request
                  </Text>
                )}
              </TouchableOpacity>
            </MotiView>

            {/* Request History Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate("RequestHistory")}
              className="flex-row items-center justify-end mt-6"
            >
              <Text className="text-zinc-500 dark:text-zinc-400 mr-2">
                View Request History
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colorScheme === "dark" ? "#f59e0b" : "#3b82f6"}
              />
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
});