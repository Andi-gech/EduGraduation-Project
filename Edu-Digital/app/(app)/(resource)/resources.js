import { 
  FlatList, 
  useColorScheme, 
  View, 
  Text, 
  ActivityIndicator 
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import DownloadCard from "../../../Components/DownloadCard";
import UseFetchResource from "../../../hooks/UseFetchResource";
import Header from "../../../Components/Header";
import Loading from "../../../Components/Loading";

export default function Resources() {
  const colorScheme = useColorScheme();
  const { data, isLoading } = UseFetchResource();
  const accentColor = colorScheme === 'dark' ? '#f59e0b' : '#3b82f6';
  const gradientColors = colorScheme === 'dark' 
    ? ["#09090b", "#18181b"] 
    : ["#f8fafc", "#ffffff"];

  return (
    <LinearGradient
      colors={gradientColors}
      locations={[0.1, 0.9]}
      className="flex-1 pt-[20px]"
    >
      <Header name="Resources" accentColor={accentColor} />
      
      {isLoading ? (
        <Loading/>
      ) : (
        <View className="flex-1 px-5 pt-4">
          <Text 
            className="text-xl font-semibold text-center mb-6"
            style={{ color: colorScheme === 'dark' ? '#f4f4f5' : '#27272a' }}
          >
            4th Year CSE Resources
          </Text>

          <FlatList
            data={data?.data}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <DownloadCard 
                item={item} 
                accentColor={accentColor}
                colorScheme={colorScheme}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}
    </LinearGradient>
  );
}