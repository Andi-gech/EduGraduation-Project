import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { Provider } from "react-redux";
import { store } from "../Redux/store";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export default function Layout() {
  const queryClient = new QueryClient();
  useReactQueryDevTools(queryClient);
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }} />
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
