import { useState, useEffect } from "react";
import { Image, Text, View, TouchableOpacity, useColorScheme, Appearance } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../../Components/Logo";
import curvestyle from "../../assets/curvestyle.png";

export default function App() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState("system");
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Determine effective theme
  const effectiveTheme = themePreference === "system" ? systemColorScheme : themePreference;

  const gradientColors = effectiveTheme === "dark" 
    ? ["#09090b", "#18181b"] 
    : ["#f8fafc", "#ffffff"];

  const accentColor = effectiveTheme === "dark" ? "#f59e0b" : "#3b82f6";

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem("themePreference");
        if (savedPreference) setThemePreference(savedPreference);
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };
    loadThemePreference();
  }, []);

  const handleThemeChange = async (theme) => {
    Appearance.setColorScheme(
           theme === "system" ? systemColorScheme : theme)
    setShowThemeMenu(false);
   
  };

  const handleStart = () => router.replace("/login");
  return (
    <LinearGradient
      colors={gradientColors}
      locations={[0.1, 0.9]}
      className="flex-1 pt-[20px]"
    >
      <StatusBar style={effectiveTheme === "dark" ? "light" : "dark"} />

      
      <TouchableOpacity 
        className="absolute top-12 right-6 z-50"
        onPress={() => setShowThemeMenu(!showThemeMenu)}
      >
        <Ionicons
          name="settings"
          size={28}
          color={accentColor}
        />
      </TouchableOpacity>

   
      {showThemeMenu && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-20 z-[100] right-6 bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl shadow-lg"
          transition={{ type: "spring" }}
        >
          <Text className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">
            App Theme
          </Text>
          <TouchableOpacity
            className="py-2"
            onPress={() => handleThemeChange("system")}
          >
            <Text className={`text-zinc-600 dark:text-zinc-400 ${themePreference === "system" ? "font-bold text-" + accentColor : ""}`}>
              🌗 System Default
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2"
            onPress={() => handleThemeChange("light")}
          >
            <Text className={`text-zinc-600 dark:text-zinc-400 ${themePreference === "light" ? "font-bold text-" + accentColor : ""}`}>
              ☀️ Light Mode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2"
            onPress={() => handleThemeChange("dark")}
          >
            <Text className={`text-zinc-600 dark:text-zinc-400 ${themePreference === "dark" ? "font-bold text-" + accentColor : ""}`}>
              🌙 Dark Mode
            </Text>
          </TouchableOpacity>
        </MotiView>
      )}

     
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="items-center mt-20"
      >
        <Logo />
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 items-center justify-center px-8"
      >
        <LinearGradient
          colors={[`${accentColor}20`, "transparent"]}
          className="p-8 rounded-3xl items-center"
        >
          <Text className="text-3xl font-bold text-center mb-4 text-zinc-800 dark:text-zinc-200">
            Ethiopian Defence University
          </Text>
          
          <Text className="text-xl text-center text-zinc-600 dark:text-zinc-400 mb-6">
            College of Engineering
          </Text>

          <Text className="text-lg text-center text-zinc-500 dark:text-zinc-500 mb-8">
            Student Portal
          </Text>

          <TouchableOpacity 
            onPress={handleStart}
            className="w-full "
          >
            <LinearGradient
              colors={[accentColor, "#c2410c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-4 rounded-2xl flex-row items-center justify-center shadow-lg"
            >
              <Text className="text-white font-bold text-lg mr-2">
                Get Started
              </Text>
              <MotiView
                from={{ translateX: 0 }}
                animate={{ translateX: 4 }}
                transition={{ loop: true, duration: 1000 }}
              >
                <Ionicons name="arrow-forward" size={24} color="white" />
              </MotiView>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </MotiView>

      
    </LinearGradient>
  );
}