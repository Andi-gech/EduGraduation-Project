import { 
  Linking, 
  TouchableOpacity, 
  View, 
  Text, 
  Animated,
  Alert
} from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';

import * as Sharing from 'expo-sharing';

export default function DownloadCard({ item, accentColor, colorScheme }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const download = async () => {
    const fileUri = `${FileSystem.documentDirectory}${item?.course?.Coursename}.pdf`;
    const downloadResumable = FileSystem.createDownloadResumable(
      `https://eduapi.senaycreatives.com/${item?.resource}`,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(progress);
      }
    );

    try {
      setIsDownloading(true);
      const { uri } = await downloadResumable.downloadAsync();
      setIsDownloading(false);
      Alert.alert('Download Complete', `File saved at ${uri}`, [
        { text: 'Open', onPress: () => openPdf(uri) },
        { text: 'OK', onPress: () => {} }
      ]);
    } catch (e) {
      setIsDownloading(false);
      Alert.alert('Download Failed', e.message);
    }
  };

  const openPdf = async (uri) => {
    try {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Open PDF',
      });
    } catch (e) {
      Alert.alert('Error', 'Unable to open PDF');
    }
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

      {isDownloading ? (
        <Progress.Circle 
          size={24} 
          progress={downloadProgress} 
          color={accentColor} 
        />
      ) : (
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
      )}
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