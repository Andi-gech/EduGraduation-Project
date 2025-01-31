import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  UIManager,
  useColorScheme,
  View,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IsLoading from '../../../../Components/Loading';
import UseFetchEvent from '../../../../hooks/UseFetchEvent';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Calendar() {
  const { data: periodEvents, isLoading } = UseFetchEvent();
  const [selectedEvent, setSelectedEvent] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const generateMarkedDates = (events) => {
    const markedDates = {};

    if (Array.isArray(events?.data)) {
      events.data.forEach((event) => {
        const startDate = new Date(event.StartDate);
        const endDate = new Date(event.EndDate);
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const currentDateStr = currentDate.toISOString().split('T')[0];
          const isStart = currentDateStr === startDate.toISOString().split('T')[0];
          const isEnd = currentDateStr === endDate.toISOString().split('T')[0];

          markedDates[currentDateStr] = {
            startingDay: isStart,
            endingDay: isEnd,
            color: isDark ? '#f59e0b' : '#3b82f6',
            textColor: isDark ? '#18181b' : '#f8fafc',
            customContainerStyle: {
              borderRadius: isStart ? 8 : 0,
              marginRight: -1,
            },
          };

          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }
      });
    }

    return markedDates;
  };

  const onDayPress = (day) => {
    const event = periodEvents?.data.find((event) => {
      const startDate = new Date(event.StartDate).toISOString().split('T')[0];
      const endDate = new Date(event.EndDate).toISOString().split('T')[0];
      return day.dateString >= startDate && day.dateString <= endDate;
    });

    if (event) {
      setSelectedEvent(event.name);
      Animated.spring(fadeAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.spring(fadeAnim, {
            toValue: 0,
            friction: 4,
            useNativeDriver: true,
          }).start(() => setSelectedEvent(''));
        }, 2000);
      });
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#09090b', '#18181b'] : ['#f8fafc', '#e2e8f0']}
      className="flex-1"
    >
      <MotiView
        from={{ translateY: -20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        className="px-4 pt-2 pb-4"
        style={{ paddingTop: insets.top }}
      >
        <LinearGradient
          colors={isDark ? ['#3b82f6', '#2563eb'] : ['#3b82f6', '#2563eb']}
          className="rounded-2xl p-4"
        >
          <Text className="text-2xl font-bold text-white text-center">
            Academic Calendar
          </Text>
        </LinearGradient>
      </MotiView>

      {isLoading ? (
        <IsLoading />
      ) : (
        <PanGestureHandler>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 px-2"
          >
            <CalendarList
              markingType="period"
              markedDates={generateMarkedDates(periodEvents)}
              onDayPress={onDayPress}
              theme={{
                calendarBackground: 'transparent',
                dayTextColor: isDark ? '#fff' : '#1e293b',
                textSectionTitleColor: isDark ? '#94a3b8' : '#64748b',
                monthTextColor: isDark ? '#fff' : '#1e293b',
                arrowColor: isDark ? '#3b82f6' : '#1e293b',
                textDisabledColor: isDark ? '#475569' : '#94a3b8',
                todayTextColor: isDark ? '#3b82f6' : '#3b82f6',
                'stylesheet.calendar.header': {
                  week: {
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 8,
                  },
                },
              }}
              dayComponent={({ date, state, marking, onPress }) => (
                <TouchableWithoutFeedback 
                  onPress={() => onPress(date)} // Add this line
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // Increase touch area
                >
                  <View className="items-center justify-center h-10">
                    <View
                      className={`w-8 h-8 rounded-lg items-center justify-center ${
                        marking?.startingDay && 'rounded-l-full'
                      } ${marking?.endingDay && 'rounded-r-full'} ${
                        state === 'disabled' ? 'opacity-50' : ''
                      }`}
                      style={{
                        backgroundColor: marking?.color,
                        marginHorizontal: -1,
                      }}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          marking?.textColor === '#f8fafc' ? 'text-white' : 'text-zinc-900'
                        }`}
                      >
                        {date.day}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </MotiView>
        </PanGestureHandler>
      )}


<Animated.View
  style={[
    styles.eventPopup,
    {
      opacity: fadeAnim,
      transform: [
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-40, 0], // More noticeable translation
          }),
        },
        {
          scale: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1], // Add scale animation
          }),
        },
      ],
      backgroundColor: isDark ? '#3b82f6' : '#1e40af',
      zIndex: 899, // Ensure it's above other elements
    },
  ]}
>
  <Icon
    name="calendar-alert"
    size={20}
    color="#fff"
    style={{ marginRight: 8 }}
  />
  <Text className="text-base font-semibold text-white">{selectedEvent}</Text>
</Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  eventPopup: {
    position: 'absolute',
    top: 100,
    left: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});