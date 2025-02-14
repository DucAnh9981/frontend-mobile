import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Button, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useAppContext } from "@/AppProvider";
import { Colors } from "@/constants/Colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import API_BASE_URL from "../../config";
import { useRouter, useLocalSearchParams } from "expo-router";

const AddImagePost = () => {
  const {
    id: currentUserId,
    name,
    role,
    sessionToken,
    setSessionToken,
    setRole,
    setId,
    setName,
    fullname,
    setFullname,
  } = useAppContext();
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const { userToken } = useAppContext();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const selectImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Thông báo",
          "Bạn cần cấp quyền truy cập vào thư viện ảnh!"
        );
        return;
      }

      // Mở thư viện ảnh để chọn
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Xử lý nếu người dùng chọn ảnh
        const selectedImages = result.assets.map((asset) => {
          const uriParts = asset.uri.split(".");
          const fileType = uriParts[uriParts.length - 1];

          return {
            uri: asset.uri,
            name: `image.${fileType}`,
            type: `image/${fileType}`,
          };
        });

        setImages((prev) => [...prev, ...selectedImages]);
      }
    } catch (error) {}
  };
  const uploadImages = async () => {
    try {
      const formData = new FormData();

      images.forEach((image, index) => {
        formData.append(`image`, image);
      });

      console.log("selectedFile", images);
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/${id}/images/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionToken}`,
          },
          maxRedirects: 0,
        }
      );

      if (response.status === 201) {
        router.push(`/post/createPostSuccess`);
      }
    } catch (error) {
      router.push('/post/createPostSuccess/')
    }
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm bước nữa</Text>
      <Text>
        Bạn có thể thêm ảnh vào bài đăng của mình để tăng tính minh bạch hơn
      </Text>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Card key={index} style={styles.imageCard}>
            <Card.Cover
              style={styles.imageDetail}
              source={{ uri: image.uri }}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemoveImage(index)}
            >
              <Text style={styles.deleteButtonText}>Xóa</Text>
            </TouchableOpacity>
          </Card>
        ))}
        <TouchableOpacity style={styles.imageSelected} onPress={selectImage}>
          <FontAwesome name="plus" size={12} color={Colors.tint} />
          <Text style={styles.textSelected}>Chọn ảnh</Text>
        </TouchableOpacity>
      </View>
      <Text>Và bạn cũng có thể bỏ qua bước này</Text>
      <Button
        mode="contained"
        style={[styles.button, { backgroundColor: Colors.tint }]}
        onPress={uploadImages}
      >
        Tiếp tục
      </Button>
      <Text style={styles.descWaring}>
        * Bằng cách nhấn Tiếp tục, bạn đã chấp nhận điều khoản sử dụng và chính
        sách bảo mật của chúng tôi
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    height: 340,
    overflow: "hidden",
  },
  imageCard: {
    width: 100,
    margin: 8,
  },
  imageSelected: {
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.tint,
    borderStyle: "dashed",
    marginTop: 8,
    marginLeft: 8,
    borderRadius: 8,
  },
  textSelected: {
    textAlign: "center",
    color: Colors.tint,
  },
  imageDetail: {
    height: 100,
  },
  button: {
    marginTop: 16,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    padding: 5,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  descWaring: {
    marginTop: 10,
    fontStyle: "italic",
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
  },
});

export default AddImagePost;
