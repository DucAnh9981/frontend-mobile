import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import LottieView from "lottie-react-native";

const CreatePostSuccess = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/");
  };
  const goToPost = () => {
    router.push("/(tabs)/post");
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/images/success-icon.json")}
        autoPlay
        style={styles.notifiIcon}
      />
      <Text style={styles.title}>Đăng bài thành công</Text>

      <Text style={styles.message}>
        Bài đăng của bạn đã được đăng lên hệ thống và đăng chờ xét duyệt, chúng
        tôi sẽ cố gắng xét duyệt nhanh nhất có thể. Cảm ơn bạn đã sử dụng dịch
        vụ của chúng tôi
      </Text>
      <TouchableOpacity style={styles.button} onPress={goToPost}>
        <Text style={styles.buttonText}>Xem lại bài đăng</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSub} onPress={goToLogin}>
        <Text style={styles.buttonTextSub}>Trở về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.tint,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  notifiIcon: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.tint,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonSub: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSub: {
    color: Colors.tint,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreatePostSuccess;
