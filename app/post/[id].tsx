import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PostDataType } from "@/types";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import Loading from "@/components/Loading";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const PostDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PostDataType>(
          `http://172.20.10.3:8000/api/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostDetail();
  }, [id]);

  const handleFavorite = () => {
    console.log("Đã nhấn vào icon ❤️");
  };

  const handleSave = () => {
    console.log("Đã nhấn vào icon 💾");
  };

  const handleReport = () => {
    console.log("Đã nhấn vào icon 🚩");
  };

  const handleUserPress = () => {
    console.log("Nhấn vào thông tin người dùng!");
  };

  const formatPrice = (price: string): string => {
    const priceNum = parseFloat(price);
    const priceInBillion = priceNum / 1_000_000_000;
    return `${priceInBillion.toFixed(1)} tỷ`;
  };

  const formatDate = (date: string): string => {
    const createdDate = new Date(date);
    return createdDate.toLocaleDateString("vi-VN");
  };

  const getValue = (value: any, defaultValue = "Đang trống") => {
    return value !== null && value !== "" ? value : defaultValue;
  };

  if (loading) {
    return (
      <View>
        <Loading size="large" color={Colors.tint} />
      </View>
    );
  }

  if (!post) {
    return (
      <View>
        <Text>Không tìm thấy dữ liệu bài đăng.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hình ảnh bài đăng */}
      <View style={styles.imageContainer}>
        <Image
          source={
            post.images
              ? { uri: post.images }
              : require("@/assets/images/background-welcome.jpg")
          }
          style={styles.image}
        />
        {/* Icon nằm ở góc phải dưới */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleFavorite}>
            <FontAwesome name="heart" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
            <FontAwesome name="bookmark" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleReport}>
            <MaterialIcons name="report" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Thông tin người đăng */}
      <View style={styles.topContent}>
        <TouchableOpacity onPress={handleUserPress} style={styles.userContainer}>
          <Image
            source={require("@/assets/images/background-welcome.jpg")}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.userName}>{getValue(post.user.username)}</Text>
            <Text style={styles.userFullname}>
              {getValue(post.user.fullname)}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.date}>Ngày đăng: {formatDate(getValue(post.created_at))}</Text>
      </View>
      {/* Nội dung bài đăng */}
      <View style={styles.content}>
        <Text style={styles.title}>{getValue(post.title)}</Text>
        <Text style={styles.price}>{formatPrice(getValue(post.price))}</Text>
        <Text style={styles.description}>{post.description}</Text>
        <Text style={styles.details}>
          Diện tích: {getValue(post.area)} m² - Hướng: {getValue(post.orientation)}
        </Text>
      </View>
      <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Thương lượng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Bình luận</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
  );
};

export default PostDetail;
const styles = StyleSheet.create({
  /* Container tổng */
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  /* Hình ảnh */
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  iconsContainer: {
    position: "absolute",
    bottom: -13,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconButton: {
    marginHorizontal: 10, // Tăng khoảng cách giữa các icon
  },

  /* Phần trên: Thông tin người dùng và ngày đăng */
  topContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userFullname: {
    fontSize: 14,
    color: Colors.lightGrey,
  },
  date: {
    fontSize: 14,
    color: Colors.lightGrey,
  },

  /* Nội dung bài đăng */
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: Colors.tint,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.darkGrey,
    lineHeight: 24,
  },
  details: {
    fontSize: 16,
    marginTop: 10,
    color: Colors.darkGrey,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: Colors.tint,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
