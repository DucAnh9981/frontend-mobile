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
import { useAppContext } from "@/AppProvider";
import AuthNoToken from "@/app/other/authNoToken";
const { width, height } = Dimensions.get("window");
const dudoan = () => {
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
  const { top: safeTop } = useSafeAreaInsets();
  const [selectedValue, setSelectedValue] = useState("");
  const [formData, setFormData] = useState({
    area: "",
    width: "",
    length: "",
    has_frontage: false,
    has_car_lane: false,
    has_rear_expansion: false,
    orientation: "Đông Nam",
    ward: "Nam Dương",
  });

  const [price, setPrice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
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
    if (!formData.area || !formData.width || !formData.length) {
      Alert.alert(
        "Cảnh báo",
        "Vui lòng nhập đầy đủ diện tích, chiều dài và chiều rộng!",
        [{ text: "OK" }]
      );
      return;
    }
console.log(formData);
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
  if (sessionToken) {
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
        <ScrollView style={[styles.formContainer, { paddingTop: safeTop }]}>
          <View style={styles.form}>
            <Text style={styles.title}>Dự đoán giá đất</Text>
            <TextInput
              style={styles.input}
              placeholder="Diện tích (m²)"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange("area", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Chiều rộng (m)"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange("width", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Chiều dài (m)"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange("length", value)}
            />

            <View style={styles.radioButtonContainer}>
              <Text style={styles.radioButtonLabel}>Có mặt tiền</Text>
              <RadioButton
                value="frontage"
                status={formData.has_frontage ? "checked" : "unchecked"}
                onPress={() =>
                  handleInputChange("has_frontage", !formData.has_frontage)
                }
              />
            </View>

            <View style={styles.radioButtonContainer}>
              <Text style={styles.radioButtonLabel}>Có đường ô tô</Text>
              <RadioButton
                value="carLane"
                status={formData.has_car_lane ? "checked" : "unchecked"}
                onPress={() =>
                  handleInputChange("has_car_lane", !formData.has_car_lane)
                }
              />
            </View>

            <View style={styles.radioButtonContainer}>
              <Text style={styles.radioButtonLabel}>Có nở hậu</Text>
              <RadioButton
                value="rearExpansion"
                status={formData.has_rear_expansion ? "checked" : "unchecked"}
                onPress={() =>
                  handleInputChange(
                    "has_rear_expansion",
                    !formData.has_rear_expansion
                  )
                }
              />
            </View>

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
  } else {
    return <AuthNoToken />;
  }
};

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
  messageIcon: {
    position: "relative",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
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
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
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
});

export default dudoan;
