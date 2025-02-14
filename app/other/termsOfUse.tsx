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
import { Link, useRouter } from "expo-router";

const TermsOfUse = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const sections = [
    {
      title: "1. Giới thiệu",
      content:
        "Chào mừng bạn đến với trang web bất động sản của chúng tôi. Bằng việc truy cập và sử dụng trang web, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng trang web.",
    },
    {
      title: "2. Định nghĩa",
      content:
        ` Người dùng: Là cá nhân hoặc tổ chức sử dụng dịch vụ của trang web.\n Nội dung: Bao gồm bài viết, bình luận, hình ảnh và thông tin khác được đăng tải trên trang web.\n Dịch vụ: Là các tính năng và chức năng mà trang web cung cấp cho người dùng.`,
    },
    {
      title: "3. Quyền và nghĩa vụ của người dùng",
      content:
        "Quyền: Được quyền đăng tải nội dung, tham gia trò chuyện, nhận thông báo. Nghĩa vụ: Cam kết cung cấp thông tin chính xác, không vi phạm pháp luật, tôn trọng người khác.",
    },
    {
      title: "4. Quyền sở hữu trí tuệ",
      content:
        "Tất cả nội dung và tài liệu trên trang web đều thuộc quyền sở hữu của chúng tôi hoặc bên thứ ba. Người dùng không được sao chép, phân phối hoặc sử dụng nội dung mà không có sự đồng ý bằng văn bản của chúng tôi.",
    },
    {
      title: "5. Chính sách bảo mật",
      content:
        "Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng. Mọi thông tin thu thập sẽ được sử dụng theo chính sách bảo mật của chúng tôi.",
    },
    {
      title: "6. Thay đổi điều khoản",
      content:
        "Chúng tôi có quyền sửa đổi các điều khoản sử dụng này bất cứ lúc nào. Người dùng sẽ được thông báo qua email hoặc thông báo trên trang web.",
    },
    {
      title: "7. Giải quyết tranh chấp",
      content:
        "Trong trường hợp có tranh chấp, các bên sẽ cố gắng giải quyết qua thương lượng. Nếu không thành công, tranh chấp sẽ được đưa ra tòa án có thẩm quyền.",
    },
    {
      title: "8. Liên hệ",
      content:
        "Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: support@batdongsan.com.",
    },
  ];

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Điều khoản sử dụng</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => router.push("/(tabs)")}>
          Đồng ý và Tiếp tục
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TermsOfUse;

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
  scrollContent: {
    padding: 16,
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
