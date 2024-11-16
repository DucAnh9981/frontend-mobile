import { Colors } from '@/constants/Colors';
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
    require("@/assets/images/background-welcome.jpg"),
    require("@/assets/images/background-welcome.jpg"),
    require("@/assets/images/background-welcome.jpg"),
];

const SlideShow = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: currentIndex * (width ), animated: true });
    }
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{  justifyContent: 'center' }} 
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}> 
            <Image
              source={image}
              style={styles.imgSliderShow}
              resizeMode="cover"
            />
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
    marginHorizontal:20
  },
  imgSliderShow: {
    width: '100%', 
    height: 200,
    marginHorizontal:10
  },
});
