import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Asset } from "expo-asset";

const TutorialModal = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const flatListRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme();

  const tutorialSteps = [
    {
      id: "1",
      title: "Explore Dec Gallery",
      description: "Discover and share stunning visual content with our community",
      image: require("../assets/post.png"),
    },
    {
      id: "2",
      title: "Digital Identity Made Easy",
      description: "Securely manage and share your digital credentials instantly",
      image: require("../assets/DigitalId.png"),
    },
    {
      id: "3",
      title: "Seamless Payments",
      description: "Handle subscriptions and payments effortlessly in one tap",
      image: require("../assets/paychapa.png"),
    },
    {
      id: "4",
      title: "Connect & Chat",
      description: "Communicate securely with end-to-end encrypted messaging",
      image: require("../assets/chatWithFriend.png"),
    },
  ];

  useEffect(() => {
    Asset.fromModule(tutorialSteps[currentIndex].image)
      .downloadAsync()
      .then(() => setIsImageLoaded(true));
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.imageContainer}>
        {!isImageLoaded && (
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
        )}
        <Image
          source={item.image}
          style={styles.image}
          contentFit="contain"
          transition={300}
          onLoad={() => setIsImageLoaded(true)}
        />
      </View>
      
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const PaginationDots = () => (
    <View style={styles.pagination}>
      {tutorialSteps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ))}
    </View>
  );

  const handleNext = () => {
    if (currentIndex < tutorialSteps.length - 1) {
      setIsImageLoaded(false);
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsImageLoaded(false);
      flatListRef.current.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <LinearGradient
          colors={["#1A1A2E", "#16213E"]}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={tutorialSteps}
            renderItem={renderItem}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />

          <PaginationDots />

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={handlePrev}
              disabled={currentIndex === 0}
              style={[styles.navButton, currentIndex === 0 && styles.disabled]}
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color={currentIndex === 0 ? "#555" : "#FFF"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              style={styles.mainButton}
            >
              <LinearGradient
                colors={["#4B6CB7", "#182848"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {currentIndex === tutorialSteps.length - 1 ? "Get Started" : "Continue"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '85%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 20,
    paddingTop: 30,
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 25,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 25,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 25,
    backgroundColor: '#FFF',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  disabled: {
    opacity: 0.5,
  },
  mainButton: {
    flex: 1,
    marginLeft: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default TutorialModal;