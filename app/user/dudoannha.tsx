import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { Video } from "expo-av";
import API_BASE_URL from "../../config";
import { useEffect } from "react";
import LottieView from "lottie-react-native";
const { width, height } = Dimensions.get("window");

const dudoannha = () => {
  const { top: safeTop } = useSafeAreaInsets();
  const [selectedValue, setSelectedValue] = useState("");
  const [formData, setFormData] = useState({
    area: "",
    floors: "",
    rooms: "",
    toilets: "",
    house_type: "Nhà mặt phố, mặt tiền",
    furnishing_sell: "Bàn giao thô",
    living_size: "",
    width: "",
    length: "",
    orientation: "Đông Nam",
    street: "",
    ward: "Hoà Sơn",
  });

  const [price, setPrice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State để điều khiển Modal
  const [error, setError] = useState(""); // State để hiển thị thông báo lỗi
  const [showPrice, setShowPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const orientations = ["Đông Nam", "Tây Nam", "Đông Bắc", "Tây Bắc" ,"Đông" , "Tây", "Nam" , "Bắc"];
  const wards = [
    "Nam Dương",
    "Hoà Cường Bắc",
    "Hoà Cường Nam",
    "Hoà Thuận Đông",
    "Hoà Thuận Tây",
    "Thanh Khê Đông",
    "Thanh Khê Tây",
    "Chính Gián",
    "Xuân Hà",
    "An Khê",
    "Tam Thuận",
    "Mân Thái",
    "Thọ Quang",
    "Phước Mỹ",
    "An Hải Bắc",
    "An Hải Đông",
    "An Hải Nam",
    "Nại Hiên Đông",
    "Mỹ An",
    "Khuê Mỹ",
    "Bắc Mỹ An",
    "Hòa Hiệp Bắc",
    "Hòa Khánh Nam",
    "Hòa Minh",
    "Hòa Hiệp Nam",
    "Khuê Trung",
  ];

  const handleInputChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleSubmit = async () => {
    // Kiểm tra nếu các trường diện tích, chiều dài và chiều rộng chưa được nhập
    if (!formData.area || !formData.width || !formData.length) {
      Alert.alert(
        "Cảnh báo",
        "Vui lòng nhập đầy đủ diện tích, chiều dài và chiều rộng!",
        [{ text: "OK" }]
      );
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/predict-price/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPrice(data.predicted_price || "Không thể dự đoán");
      setModalVisible(true);
      setTimeout(() => {
        setShowPrice(true);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require("@/assets/videos/videoAI.mp4")} // Đường dẫn đến video
        rate={1.0}
        volume={1.0}
        isMuted={true}
        shouldPlay
        isLooping
        resizeMode="cover"
        style={styles.backgroundVideo}
      />
      <ScrollView style={[styles.formContainer, { paddingTop: safeTop }]}>
        <View style={styles.form}>
          {/* Input Diện tích */}
          <Text style={styles.title}>Dự đoán giá nhà</Text>
          <TextInput
            style={styles.input}
            placeholder="Diện tích (m²)"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("area", value)}
          />

          {/* Input Chiều rộng */}
          <TextInput
            style={styles.input}
            placeholder="Chiều rộng (m)"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("width", value)}
          />

          {/* Input Chiều dài */}
          <TextInput
            style={styles.input}
            placeholder="Chiều dài (m)"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("length", value)}
          />

          {/* Input Số tầng */}
          <TextInput
            style={styles.input}
            placeholder="Số tầng"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("floors", value)}
          />

          {/* Input Số phòng */}
          <TextInput
            style={styles.input}
            placeholder="Số phòng"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("rooms", value)}
          />

          {/* Input Số nhà vệ sinh */}
          <TextInput
            style={styles.input}
            placeholder="Số nhà vệ sinh"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("toilets", value)}
          />

          {/* Picker Loại nhà */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Loại nhà</Text>
            <Picker
              selectedValue={formData.house_type}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleInputChange("house_type", itemValue)
              }
            >
              <Picker.Item
                label="Nhà mặt phố, mặt tiền"
                value="Nhà mặt phố, mặt tiền"
              />
              <Picker.Item label="Nhà ngõ, hẻm" value="Nhà ngõ, hẻm" />
              <Picker.Item label="Nhà biệt thự" value="Nhà biệt thự" />
              <Picker.Item label="Nhà phố liền kề" value="Nhà phố liền kề" />

              {/* Thêm các loại nhà khác nếu cần */}
            </Picker>
          </View>

          {/* Picker Hình thức bán */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Hình thức bán</Text>
            <Picker
              selectedValue={formData.furnishing_sell}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleInputChange("furnishing_sell", itemValue)
              }
            >
              <Picker.Item label="Bàn giao thô" value="Bàn giao thô" />
              <Picker.Item
                label="Hoàn thiện cơ bản"
                value="Hoàn thiện cơ bản"
              />
              <Picker.Item label="Nội thất đầy đủ" value="Nội thất đầy đủ" />
              <Picker.Item label="Nội thất cao cấp" value="Nội thất cao cấp" />
            </Picker>
          </View>

          {/* Input Diện tích sử dụng */}
          <TextInput
            style={styles.input}
            placeholder="Diện tích sử dụng (m²)"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("living_size", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Đường"
            onChangeText={(value) => handleInputChange("street", value)}
          />

          {/* Picker Hướng */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Hướng</Text>
            <Picker
              selectedValue={formData.orientation}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleInputChange("orientation", itemValue)
              }
            >
              {orientations.map((orientation, index) => (
                <Picker.Item
                  key={index}
                  label={orientation}
                  value={orientation}
                />
              ))}
            </Picker>
          </View>

          {/* Picker Phường/quận */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Phường</Text>
            <Picker
              selectedValue={formData.ward}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleInputChange("ward", itemValue)
              }
            >
              {wards.map((ward, index) => (
                <Picker.Item key={index} label={ward} value={ward} />
              ))}
            </Picker>
          </View>

          {/* Nút gửi */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Dự đoán giá</Text>
          </TouchableOpacity>

          {/* Hiển thị lỗi nếu có */}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </ScrollView>

      {/* Modal hiển thị giá dự đoán */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loading ? (
              <LottieView
                source={require("@/assets/images/loading-icon.json")}
                autoPlay
                loop
                style={styles.messageIcon}
              />
            ) : showPrice ? (
              <View>
                <Text style={styles.title}>AI SweetHome cho biết</Text>
                <Text style={styles.modalText}>
                  Giá dự đoán về bất động sản của bạn là:{" "}
                </Text>
                <Text style={styles.subtitle}>{price} VNĐ</Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    marginBottom: 10,
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
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.tint,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.darkGrey,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  form: {
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  radioButtonLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  pickerLabel: {
    fontSize: 16,
  },
  picker: {
    height: 80,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: Colors.tint,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  result: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.tint,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors.tint,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inputGroup: {
    width: 160,
    backgroundColor: "white",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageIcon: {
    position: "relative",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});

export default dudoannha;
