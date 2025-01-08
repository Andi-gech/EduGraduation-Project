import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "red",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Cafe",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "qr-code" : "qr-code"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Gate"
          options={{
            title: "Gate-Out",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "qr-code-sharp" : "qr-code-sharp"}
                color={color}
              />
            ),
          }} />
          <Tabs.Screen
          name="GateIn"
          options={{
            title: "Gate-In",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "qr-code-sharp" : "qr-code-sharp"}
                color={color}
              />
            ),
          }} />
      </Tabs>
    </QueryClientProvider>
  );
}
