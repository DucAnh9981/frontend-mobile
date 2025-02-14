import { PostImage } from "@/types";
import React, { useState } from "react";
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
} from "react-native";
interface SlideShowImgPostProps {
  img: string[]; // Nhận vào mảng các URL hình ảnh
}

const SlideShowImgPost: React.FC<SlideShowImgPostProps> = ({ img }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpandedImageVisible, setIsExpandedImageVisible] = useState(false);

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? img.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === img.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImagePress = () => {
    setIsExpandedImageVisible(true);
  };

  const handleModalClose = () => {
    setIsExpandedImageVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={{ uri: img[currentImageIndex] }}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handlePrevious} style={styles.button}>
          <Text style={styles.buttonText}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isExpandedImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.overlayModal}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={handleModalClose}
            >
              <Text style={styles.buttonText}>x</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: img[currentImageIndex] }}
              style={styles.expandedImage}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  imageContainer: { width: "100%", height: 200, overflow: "hidden" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: "50%",
    width: "100%",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 5,
    borderRadius: 20,
  },
  buttonText: { color: "white", fontSize: 20 ,paddingHorizontal:10,},
  overlayModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    
  },
  closeModalButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  expandedImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
    maxHeight: "80%",
  },
});

export default SlideShowImgPost;
