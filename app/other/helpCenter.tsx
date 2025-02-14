import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";

const HelpCenter = () => {
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: "1. Giới thiệu",
      content:
        "Trung tâm trợ giúp cung cấp thông tin và hỗ trợ cần thiết cho người dùng trong quá trình sử dụng dịch vụ của chúng tôi. Nếu bạn gặp bất kỳ vấn đề nào, hãy tham khảo các mục dưới đây hoặc liên hệ với chúng tôi để được hỗ trợ.",
    },
    {
      title: "2. Câu hỏi thường gặp (FAQ)",
      content: `2.1. Làm cách nào để đăng ký tài khoản?\n- Truy cập trang đăng ký.\n- Điền đầy đủ thông tin cần thiết.\n- Nhấn nút \"Đăng ký\" và xác nhận qua email.\n\n2.2. Tôi có thể thay đổi thông tin tài khoản không?\n- Đăng nhập vào tài khoản.\n- Truy cập vào phần \"Cài đặt tài khoản\".\n- Cập nhật thông tin và lưu lại.\n\n2.3. Làm thế nào để đăng bài bất động sản?\n- Đăng nhập vào tài khoản của bạn.\n- Chọn mục \"Đăng bài\".\n- Điền thông tin chi tiết về bất động sản và nhấn \"Gửi\".`,
    },
    {
      title: "3. Hỗ trợ kỹ thuật",
      content:
        "Nếu bạn gặp phải sự cố kỹ thuật, hãy thử các bước sau:\n\n- Kiểm tra kết nối Internet: Đảm bảo rằng bạn có kết nối Internet ổn định.\n- Xóa bộ nhớ cache: Xóa bộ nhớ cache và cookies của trình duyệt.\n- Thử trình duyệt khác: Nếu vấn đề vẫn tiếp diễn, hãy thử sử dụng trình duyệt khác.\n\nNếu vấn đề vẫn chưa được giải quyết, vui lòng gửi yêu cầu hỗ trợ qua email hoặc biểu mẫu liên hệ trên trang web.",
    },
    {
      title: "4. Liên hệ với chúng tôi",
      content:
        "Nếu bạn cần thêm sự trợ giúp hoặc có câu hỏi nào khác, hãy liên hệ với chúng tôi qua các kênh sau:\n\n- Email: support@batdongsan.com\n- Điện thoại: 0123-456-789\n- Chat trực tuyến: Có sẵn trên trang web từ 8:00 đến 20:00 hàng ngày.",
    },
    {
      title: "5. Đánh giá và phản hồi",
      content:
        "Chúng tôi luôn mong muốn cải thiện dịch vụ của mình. Nếu bạn có bất kỳ ý kiến, phản hồi hoặc đề xuất nào, xin vui lòng chia sẻ với chúng tôi qua email hoặc biểu mẫu phản hồi trên trang web.",
    },
  ];

  return (
    <View style={[styles.container]}>
     <Text style={styles.title}>Trung tâm trợ giúp</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Liên hệ hỗ trợ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HelpCenter;

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
  button: {
    backgroundColor: Colors.tint,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 16,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
