import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";

const AboutUs = () => {
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: "Về Chúng Tôi",
      content:
        "Chào mừng bạn đến với trang web bất động sản của chúng tôi! Chúng tôi là một nhóm sinh viên đến từ Trường Đại học Bách Khoa - Đại học Đà Nẵng, với mong muốn tạo ra một nền tảng kết nối người dùng trong lĩnh vực bất động sản.",
    },
    {
      title: "Đội Ngũ",
      content: `1. Nguyễn Đức Anh\nChuyên ngành: Kỹ thuật phần mềm\nVai trò: Frontend Developer (Mobile)\nGiới thiệu: Đức Anh là người có đam mê với công nghệ và thiết kế ứng dụng di động. Anh luôn tìm kiếm những giải pháp sáng tạo để cải thiện trải nghiệm người dùng trên nền tảng di động.\n\n2. Bùi Anh Vũ\nChuyên ngành: Kỹ thuật phần mềm\nVai trò: Frontend Developer (Web)\nGiới thiệu: Với kiến thức sâu rộng về phát triển giao diện web, Anh Vũ phụ trách xây dựng và tối ưu hóa trải nghiệm người dùng trên nền tảng web. Anh luôn nỗ lực để mang lại giá trị tốt nhất cho người dùng.\n\n3. Nguyễn Nhật Quang\nChuyên ngành: Kỹ thuật phần mềm\nVai trò: Backend Developer (Triển khai API)\nGiới thiệu: Nhật Quang là một lập trình viên tài năng, chuyên về triển khai các API mạnh mẽ và hiệu quả. Anh có trách nhiệm đảm bảo rằng hệ thống backend hoạt động mượt mà và ổn định.\n\n4. Trần Thị Hồng Nhung\nChuyên ngành: Kỹ thuật phần mềm\nVai trò: Backend Developer (AI)\nGiới thiệu: Hồng Nhung phụ trách phát triển các giải pháp AI và tích hợp chúng vào hệ thống backend. Cô ấy luôn tìm kiếm những cách sáng tạo để tối ưu hóa hiệu suất và nâng cao giá trị của nền tảng.`,
    },
    {
      title: "Sứ Mệnh",
      content:
        "Chúng tôi cam kết cung cấp một nền tảng an toàn, tiện lợi và hiệu quả cho người dùng trong việc tìm kiếm, đăng tải và tương tác về bất động sản. Chúng tôi tin rằng, với sự kết hợp giữa công nghệ và sự sáng tạo, chúng tôi có thể tạo ra một môi trường giao tiếp và kết nối tốt nhất cho mọi người.",
    },
    {
      title: "Tầm Nhìn",
      content:
        "Mục tiêu của chúng tôi là trở thành một trong những nền tảng bất động sản hàng đầu tại Việt Nam, nơi mà mọi người có thể dễ dàng tìm kiếm thông tin và kết nối với nhau một cách hiệu quả.",
    },
  ];

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Về chúng tôi</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    color: Colors.tint,
    lineHeight: 30,
    fontWeight: "bold",
    margin: 10,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.tint,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: Colors.darkGrey,
    lineHeight: 24,
  },
});
