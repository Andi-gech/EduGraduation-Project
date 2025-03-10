
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import RoundButton from '../../../../Components/RoundButton';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function About() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const accentColor = colorScheme === 'dark' ? '#f59e0b' : '#3b82f6';

  return (
    <LinearGradient
      colors={colorScheme === 'dark' ? ['#09090b', '#18181b'] : ['#f8fafc', '#e2e8f0']}
      className="flex-1 pt-[20px]"
    >
      {/* Fixed Header Section */}
      <View className="px-4 pt-4">
        <RoundButton
          icon="arrowleft"
          onPress={() => navigation.goBack()}
          iconColor={accentColor}
          className="mb-4"
        />

        <View
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="items-center mb-8"
        >
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            className="p-4 rounded-2xl items-center justify-center"
            style={{ width: 100, height: 100 }}
          >
            <Icon name="information-circle" size={40} color="white" />
          </LinearGradient>
          <Text className="text-2xl font-bold text-black dark:text-white mt-4">
            About Dec Hub
          </Text>
        </View>
      </View>

      {/* Scrollable White Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-6 space-y-6 mx-4"
          style={{
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
        >
          {/* Content Sections (same as before) */}
          <View className="space-y-2">
            <View className="flex-row items-center space-x-2">
              <Icon name="people" size={20} color={accentColor} />
              <Text className="text-lg font-semibold text-black dark:text-white">
                Development Team
              </Text>
            </View>
            <View className="space-y-1 pl-7">
              <Text className="text-zinc-600 dark:text-zinc-300">Andualem Getachew</Text>
              <Text className="text-zinc-600 dark:text-zinc-300">Mikias Adamu</Text>
              <Text className="text-zinc-600 dark:text-zinc-300">Samuel Kumsa</Text>
            </View>
          </View>

          <View className="space-y-2">
            <View className="flex-row items-center space-x-2">
              <Icon name="ribbon" size={20} color={accentColor} />
              <Text className="text-lg font-semibold text-black dark:text-white">
                Project Advisor
              </Text>
            </View>
            <Text className="text-zinc-600 dark:text-zinc-300 pl-7">Lt Solomon.T</Text>
          </View>

          <View className="space-y-2">
            <View className="flex-row items-center space-x-2">
              <Icon name="git-branch" size={20} color={accentColor} />
              <Text className="text-lg font-semibold text-black dark:text-white">
                Version Information
              </Text>
            </View>
            <View className="pl-7">
              <Text className="text-zinc-600 dark:text-zinc-300">Version: 1.0.0</Text>
              <Text className="text-zinc-600 dark:text-zinc-300">Build: 1</Text>
            </View>
          </View>

          <View className="space-y-2">
            <View className="flex-row items-center space-x-2">
              <Icon name="document-text" size={20} color={accentColor} />
              <Text className="text-lg font-semibold text-black dark:text-white">
                About Dec Hub
              </Text>
            </View>
            <Text className="text-zinc-600 dark:text-zinc-300 leading-6">
              Dec Hub is an educational platform designed to connect students and teachers, 
              enabling seamless resource sharing, collaboration, and academic interaction 
              within a modern digital environment.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Decorative Elements (fixed position) */}
      <View
        from={{ rotate: '0deg' }}
        animate={{ rotate: '25deg' }}
        transition={{ loop: true, duration: 25000 }}
        className="absolute -right-20 -top-20 opacity-10"
      >
        <LinearGradient
          colors={['#3b82f6', '#2563eb']}
          className="w-40 h-40 rounded-3xl"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
});