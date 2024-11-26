import {
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
  UIManager,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { CalendarList } from "react-native-calendars";
import UseFetchEvent from "../../../../hooks/UseFetchEvent";
import IsLoading from "../../../../Components/Loading";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Calendar() {
  const { data: periodEvents, isLoading } = UseFetchEvent();

  const [selectedEvent, setSelectedEvent] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const generateMarkedDates = (events) => {
    const markedDates = {};

    if (Array.isArray(events?.data)) {
      events?.data.forEach((event) => {
        const startDate = new Date(event.StartDate); // Use Date object here
        const endDate = new Date(event.EndDate); // Use Date object here

        // Convert startDate and endDate to YYYY-MM-DD format
        let currentDate = new Date(startDate); // Keep as Date object
        const endDateStr = endDate.toISOString().split("T")[0]; // End date in YYYY-MM-DD format

        // Loop from startDate to endDate, marking all days in between
        while (currentDate <= endDate) {
          const currentDateStr = currentDate.toISOString().split("T")[0]; // Get string representation of the date

          if (currentDateStr === startDate.toISOString().split("T")[0]) {
            markedDates[currentDateStr] = {
              startingDay: true,
              color: "orange",
              textColor: "white",
            };
          } else if (currentDateStr === endDateStr) {
            markedDates[currentDateStr] = {
              endingDay: true,
              color: "orange",
              textColor: "lightgray",
            };
          } else {
            markedDates[currentDateStr] = {
              selected: true,
              color: "orange",
              textColor: "white",
            };
          }

          // Move to the next day
          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Increment by one day
        }
      });
    }

    return markedDates;
  };

  const onDayPress = (day) => {
    const event = periodEvents?.data.find((event) => {
      const startDate = new Date(event.StartDate).toISOString().split("T")[0];

      const endDate = new Date(event.EndDate).toISOString().split("T")[0];

      return day.dateString >= startDate && day.dateString <= endDate;
    });

    if (event) {
      setSelectedEvent(event.name);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }).start(() => setSelectedEvent(""));
        }, 2000);
      });
    } else {
      setSelectedEvent("");
    }
  };
  const colorScheme = useColorScheme();

  return (
    <View className=" flex-1 bg-white dark:bg-black">
      <View style={darkStyles.header}>
        <Text className=" text-black font-bold text-[20px] dark:text-white  ">
          Academic Calendar
        </Text>
      </View>
      {isLoading && <IsLoading />}
      {periodEvents && (
        <CalendarList
          markingType={"period"}
          markedDates={generateMarkedDates(periodEvents)}
          onDayPress={onDayPress}
          theme={{
            calendarBackground: colorScheme === "dark" ? "#000" : "#fff",
            dayTextColor: colorScheme === "dark" ? "#fff" : "#000",
            textDisabledColor: "#555",
            monthTextColor: colorScheme === "dark" ? "#fff" : "#000",
            arrowColor: colorScheme === "dark" ? "#fff" : "#000",
          }}
        />
      )}
      {selectedEvent ? (
        <Animated.View style={[darkStyles.eventPopup, { opacity: fadeAnim }]}>
          <Text style={darkStyles.eventPopupText}>{selectedEvent}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const darkStyles = StyleSheet.create({
  header: {
    width: "100%",
    height: 60,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
  },
  eventPopup: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  eventPopupText: {
    color: "#fff",
    fontSize: 16,
  },
});
