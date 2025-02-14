import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

export default function PredictPriceScreen() {
  const { top: safeTop } = useSafeAreaInsets();
  const router = useRouter();

  const [formData, setFormData] = useState({
    area: "",
    width: "",
    length: "",
    has_frontage: false,
    has_car_lane: false,
    has_rear_expansion: false,
    orientation: "",
    ward: "",
  });
  const [price, setPrice] = useState(null);

  const orientations = [
    "Đông Nam",
    "Tây Nam",
    "Đông Bắc",
    "Tây Bắc",
    "Tây",
    "Đông",
    "Nam",
    "Bắc",
  ];
  const wards = ["Hòa Sơn", "Mỹ An", "Mỹ Khê", "Cẩm Lệ", "Hải Châu", "Thanh Khê"];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
   
  };

  return (
    <View style={styles.container}>
      <Video
        source={require("@/assets/videos/videoAI.mp4")}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        shouldPlay
        isLooping
        resizeMode="cover"
        style={styles.backgroundVideo}
      />
      <View style={[styles.formContainer, { paddingTop: safeTop }]}>
        <Text style={styles.title}>AI Dự Đoán Giá</Text>
        <Text style={styles.subtitle}>
          Nhập thông tin bất động sản để AI giúp bạn dự đoán giá trị nhanh chóng
          và chính xác. Hãy cung cấp các thông tin về diện tích, mặt tiền, đường
          ô tô, hướng nhà và khu vực để mô hình AI của chúng tôi đưa ra dự đoán
          tốt nhất.
        </Text>
        <Text style={styles.infoText}>
          AI sẽ phân tích các yếu tố như diện tích, hướng nhà, tình trạng mặt
          tiền và các yếu tố khác để đưa ra dự đoán chính xác nhất về giá trị
          bất động sản. Hãy nhập thông tin và nhấn "Bắt đầu sử dụng" để trải
          nghiệm!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/user/dudoan")}
        >
          <Text style={styles.buttonText}>Dự đoán giá đất</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/user/dudoannha")}
        >
          <Text style={styles.buttonText}>Dự đoán giá nhà</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", 
  },
  backgroundVideo: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  formContainer: {
    flex: 1,
    zIndex: 10, // Đảm bảo nội dung nằm trên video
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.tint,
    textAlign: "center",
    marginVertical: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.white,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  infoText: {
    fontSize: 14,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    backgroundColor: Colors.tint,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
