import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const RegistrationSuccess = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.replace("/auth/login"); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký thành công!</Text>
      <Text style={styles.message}>
        Chúng tôi đã gửi một email xác nhận tới địa chỉ của bạn. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản và hoàn tất đăng ký.
      </Text>
      <TouchableOpacity style={styles.button} onPress={goToLogin}>
        <Text style={styles.buttonText}>Trở về trang Đăng nhập</Text>
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
    color: "#333",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegistrationSuccess;
