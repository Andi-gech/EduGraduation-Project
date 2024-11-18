import {
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
  UIManager,
} from "react-native";
import React, { useState } from "react";
import { CalendarList } from "react-native-calendars";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Calendar() {
  const [periodEvents] = useState([
    {
      startDate: "2024-06-22",
      endDate: "2024-06-23",
      color: "lightblue",
      name: "Event 1",
    },
    {
      startDate: "2024-06-25",
      endDate: "2024-06-28",
      color: "lightgray",
      name: "Event 2",
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const generateMarkedDates = (events) => {
    const markedDates = {};
    events.forEach((event) => {
      let currentDate = event.startDate;
      while (currentDate <= event.endDate) {
        if (currentDate === event.startDate) {
          markedDates[currentDate] = {
            startingDay: true,
            color: event.color,
            textColor: "white", // Light text on dark background
          };
        } else if (currentDate === event.endDate) {
          markedDates[currentDate] = {
            endingDay: true,
            color: event.color,
            textColor: "lightgray", // Slightly lighter text
          };
        } else {
          markedDates[currentDate] = {
            selected: true,
            color: event.color,
            textColor: "white",
          };
        }
        currentDate = new Date(
          new Date(currentDate).getTime() + 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0];
      }
    });
    return markedDates;
  };

  const onDayPress = (day) => {
    const event = periodEvents.find((event) => {
      return (
        day.dateString >= event.startDate && day.dateString <= event.endDate
      );
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

  return (
    <View style={darkStyles.container}>
      <View style={darkStyles.header}>
        <Text style={darkStyles.headerText}>Academic Calendar</Text>
      </View>
      <CalendarList
        markingType={"period"}
        markedDates={generateMarkedDates(periodEvents)}
        onDayPress={onDayPress}
        theme={{
          calendarBackground: "#000", // Dark background for the calendar
          dayTextColor: "#fff", // White text for the day numbers
          textDisabledColor: "#555", // Dimmed color for disabled dates
          monthTextColor: "#fff", // White text for month name
          arrowColor: "#fff", // White arrows for navigation
        }}
      />
      {selectedEvent ? (
        <Animated.View style={[darkStyles.eventPopup, { opacity: fadeAnim }]}>
          <Text style={darkStyles.eventPopupText}>{selectedEvent}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Dark background
  },
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
    color: "#fff", // White text
  },
  eventPopup: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Dark semi-transparent background
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  eventPopupText: {
    color: "#fff", // White text
    fontSize: 16,
  },
});
