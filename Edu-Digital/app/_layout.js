import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { Provider } from "react-redux";
import { store } from "../Redux/store";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function Layout() {
  const queryClient = new QueryClient();
  useReactQueryDevTools(queryClient);
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={colorScheme} />
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </QueryClientProvider>
  );
}
