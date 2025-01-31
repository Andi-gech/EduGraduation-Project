// DownloadCard.js
import { 
  Linking, 
  TouchableOpacity, 
  View, 
  Text, 
  Animated 
} from "react-native";
import React, { useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function DownloadCard({ item, accentColor, colorScheme }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const download = () => {
    Linking.openURL(`https://eduapi.senaycreatives.com/${item?.resource}`);
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(39, 39, 42, 0.5)' 
            : 'rgba(255, 255, 255, 0.7)',
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
        },
        styles.card
      ]}
    >
      <View className="flex-1">
        <Text 
          className="text-lg font-semibold mb-1"
          style={{ color: colorScheme === 'dark' ? '#f4f4f5' : '#27272a' }}
        >
          {item?.course?.Coursename}
        </Text>
        <Text 
          className="text-sm"
          style={{ color: colorScheme === 'dark' ? '#a1a1aa' : '#52525b' }}
        >
          {item?.size} MB
        </Text>
      </View>

      <TouchableOpacity
        onPress={download}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{ 
          backgroundColor: `${accentColor}20`,
          borderRadius: 24,
          padding: 12
        }}
      >
        <MaterialCommunityIcons
          name="download-outline"
          size={24}
          color={accentColor}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = {
  card: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};