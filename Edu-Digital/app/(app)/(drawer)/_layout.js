import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomDrawerContent from "../../../Components/Drawercontent";
import { useColorScheme } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useCallback } from 'react';

export default function Layout() {
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === 'dark' ? '#f59e0b' : '#3b82f6';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  // Memoized drawer content with proper dependencies
  const drawerContent = useCallback((props) => (
    <LinearGradient
      colors={colorScheme === 'dark' 
        ? ['#09090b', '#262626'] 
        : ['#f8fafc', '#ffffff']}
      style={{ flex: 1 }}
    >
      <CustomDrawerContent {...props} />
    </LinearGradient>
  ), [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={drawerContent}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: '78%',
            backgroundColor: 'white',
          },
          drawerLabelStyle: {
            color: textColor,

            fontSize: 16,
            marginLeft: 10,
          },
          drawerItemStyle: {
            borderRadius: 12,
            marginHorizontal: 6,
            marginVertical: 4,
          },
          drawerActiveBackgroundColor: `${accentColor}20`,
          drawerActiveTintColor: accentColor,
          drawerInactiveTintColor: `${textColor}90`,
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "Home",
            drawerIcon: ({ focused, size }) => (
              <MotiView
                animate={{ scale: focused ? 1.1 : 1 }}
                transition={{ type: 'timing' }}
              >
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={size}
                  color={focused ? accentColor : textColor}
                />
              </MotiView>
            ),
          }}
        />

        <Drawer.Screen
          name="Profile"
          options={{
            title: "Profile",
            drawerIcon: ({ focused, size }) => (
              <MotiView
                animate={{ scale: focused ? 1.1 : 1 }}
                transition={{ type: 'timing' }}
              >
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={size}
                  color={focused ? accentColor : textColor}
                />
              </MotiView>
            ),
          }}
        />

        <Drawer.Screen
          name="Notifications"
          options={{
            title: "Notifications",
            drawerIcon: ({ focused, size }) => (
              <MotiView
                animate={{ scale: focused ? 1.1 : 1 }}
                transition={{ type: 'timing' }}
              >
                <Ionicons
                  name={focused ? 'notifications' : 'notifications-outline'}
                  size={size}
                  color={focused ? accentColor : textColor}
                />
              </MotiView>
            ),
          }}
        />

        <Drawer.Screen
          name="Settings"
          options={{
            title: "Settings",
            drawerIcon: ({ focused, size }) => (
              <MotiView
                animate={{ scale: focused ? 1.1 : 1 }}
                transition={{ type: 'timing' }}
              >
                <Ionicons
                  name={focused ? 'settings' : 'settings-outline'}
                  size={size}
                  color={focused ? accentColor : textColor}
                />
              </MotiView>
            ),
          }}
        />

        <Drawer.Screen
          name="Academic"
          options={{
            title: "Academic",
            drawerIcon: ({ focused, size }) => (
              <MotiView
                animate={{ scale: focused ? 1.1 : 1 }}
                transition={{ type: 'timing' }}
              >
                <MaterialCommunityIcons
                  name={focused ? 'book-open' : 'book-open-outline'}
                  size={size}
                  className="px-2"
                  color={focused ? accentColor : textColor}
                />
              </MotiView>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}