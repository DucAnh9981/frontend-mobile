import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const Guide = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Hướng dẫn sử dụng</Text>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. Đăng ký và đăng nhập</Text>
        <Text style={styles.text}>
          - <Text style={styles.bold}>Đăng ký:</Text> Nhập thông tin email, tên
          đăng nhập, mật khẩu. Xác minh email để kéo dài quyền truy cập.
        </Text>
        <Text style={styles.text}>
          - <Text style={styles.bold}>Đăng nhập:</Text> Sử dụng tên đăng nhập
          hoặc email cùng mật khẩu.
        </Text>
        <Text style={styles.sectionTitle}>2. Tạo bài đăng</Text>
        <Text style={styles.text}>
          - <Text style={styles.bold}>Bước 1:</Text> Điền các thông tin cơ bản
          như tên bài đăng, mô tả chi tiết, loại hình bất động sản (bán/cho
          thuê).
        </Text>
        <Text style={styles.text}>
          - <Text style={styles.bold}>Bước 2:</Text> Tải lên tối đa 9 hình ảnh,
          có thể xem trước trước khi đăng bài.
        </Text>
        <Text style={styles.text}>
          - <Text style={styles.bold}>Bước 3:</Text> Nhấn "Đăng bài" để hoàn
          tất.
        </Text>

        <Text style={styles.sectionTitle}>
          3. Thích, lưu, và bình luận bài viết
        </Text>
        <Text style={styles.text}>
          - Thả tim, lưu bài, và để lại bình luận ngay dưới bài viết.
        </Text>

        <Text style={styles.sectionTitle}>4. Thương lượng giá</Text>
        <Text style={styles.text}>
          - Khách hàng: Nhấn "Thương lượng" và nhập mức giá mong muốn.
        </Text>
        <Text style={styles.text}>
          - Người bán: Nhận đề nghị, đồng ý hoặc từ chối theo nhu cầu.
        </Text>

        <Text style={styles.sectionTitle}>5. Chatroom</Text>
        <Text style={styles.text}>
          - Trao đổi trực tiếp qua chatroom khi thương lượng giá thành công.
        </Text>

        <Text style={styles.sectionTitle}>6. Cập nhật thông tin cá nhân</Text>
        <Text style={styles.text}>
          - Cập nhật tên hiển thị, ảnh đại diện, và thông tin cá nhân trong mục
          "Thông tin cá nhân".
        </Text>

        <Text style={styles.sectionTitle}>7. Hỗ trợ</Text>
        <Text style={styles.text}>
          - Liên hệ qua mục "Liên hệ" hoặc email hỗ trợ để được giúp đỡ khi cần.
        </Text>
      </ScrollView>
    </View>
  );
};

export default Guide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 18,
    color: Colors.tint,
    lineHeight: 30,
    fontWeight: "bold",
    margin: 10,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.tint,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: Colors.lightGrey,
    marginBottom: 8,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
  },
});
