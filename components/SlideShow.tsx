import { Colors } from '@/constants/Colors';
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, Text, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
    { 
      source: require("@/assets/images/hero-bg4.jpg"), 
      text: 'Chào mừng bạn đến với ứng dụng SweetHome!' 
    },
    { 
      source: require("@/assets/images/hero-bg2.jpg"), 
      text: 'Khám phá không gian sống lý tưởng cùng SweetHome!' 
    },
    { 
      source: require("@/assets/images/hero-bg5.jpg"), 
      text: 'Cùng SweetHome, tìm kiếm ngôi nhà mơ ước của bạn!' 
    },
];

const SlideShow = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 4000);

    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: currentIndex * width, animated: true });
    }
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: 'center' }}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}> 
            <Image
              source={image.source}
              style={styles.imgSliderShow}
              resizeMode="cover"
            />
            <Animated.View style={[styles.textWrapper, { opacity: fadeAnim }]}>
              <Text style={styles.imageText}>{image.text}</Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SlideShow;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    justifyContent: 'center',
    width: width,
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: width - 40,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  imgSliderShow: {
    width: '100%',
    height: 200,
    marginHorizontal: 10,
  },
  textWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent:"center"
  },
  imageText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});
