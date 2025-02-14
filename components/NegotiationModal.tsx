import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../config";
import { useAppContext } from "@/AppProvider";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";

import NegotiationDetailModal from "@/components/NegotiationDetailModal";
import CreateNegotiationModal from "@/components/createNegotiationModal";
interface NegotiationModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  price: string;
  type: string;
  idUser: string;
}

const NegotiationModal: React.FC<NegotiationModalProps> = ({
  visible,
  onClose,
  postId,
  price,
  type,
  idUser,
}) => {
  const { id, fullname, setFullname, sessionToken } = useAppContext();
  const [offerPrice, setOfferPrice] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [transactionMethod, setTransactionMethod] = useState("một lần");
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [filter, setFilter] = useState("profile_completeness");
  const [order, setOrder] = useState("desc");
  const [amount, setAmount] = useState("5");
  const [selectedNegotiation, setSelectedNegotiation] = useState("");
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [isNegotiationModalVisible, setIsNegotiationModalVisible] =
    useState(false);
  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const isPostOwner = idUser === id;

  const handleSubmit = async () => {
    if (!offerPrice.trim() || !startDate || !transactionMethod.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (Number(offerPrice) < Number(price) * 0.7) {
      Alert.alert("Giá đề xuất không được thấp hơn 70% giá sản phẩm.");
      return false;
    }
    console.log(
      offerPrice +
        " " +
        formatDate(startDate) +
        " " +
        transactionMethod +
        " " +
        notes
    );
    try {
      // Gửi yêu cầu tới API
      const response = await fetch(
        `${API_BASE_URL}/api/post-negotiations/${postId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            negotiation_price: offerPrice,
            negotiation_date: formatDate(startDate),
            payment_method: transactionMethod,
            negotiation_note: notes,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Thành công", "Thương lượng đã được gửi!");
        onClose();
      } else {
        const result = await response.json();
        Alert.alert("Lỗi", result.message || "Thương lượng đã tồn tại.");
      }
    } catch (error) {
      console.error("Error sending negotiation:", error);
      Alert.alert("Lỗi", "Không thể gửi thương lượng. Vui lòng thử lại sau.");
    }
  };
  const fetchNegotiations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/post-negotiations/${postId}/?sort_by=${filter}&order=${order}&amount=${amount}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      console.log("gọi lại");
      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        Alert.alert("Lỗi", "Không thể tải danh sách thương lượng.");
        return;
      }
      // console.log(response)
      const data = await response.json();
      const filteredNegotiations = data.negotiations.filter(
        (negotiation) => !negotiation.is_considered
      );

      setNegotiations(filteredNegotiations);
    } catch (error) {
      console.error("Error fetching negotiations:", error);
      Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderNegotiationItem = ({ item }: { item: any }) => {
    console.log("Rendering item:", item);
    return (
      <TouchableOpacity
        style={styles.negotiationItem}
        onPress={() => {
          setSelectedNegotiation(item.negotiation_id);
          setIsSecondModalVisible(true);
        }}
      >
        <Text style={styles.negotiationTitle}>
          Giá đề xuất: {item.negotiation_price}
        </Text>
        <Text>
          Ngày thương lượng:{""}
          {new Date(item.negotiation_date).toLocaleDateString()}
        </Text>
        <Text>Phương thức: {item.payment_method}</Text>
        <Text>Ghi chú: {item.negotiation_note || "Không có"}</Text>
      </TouchableOpacity>
    );
  };
  const toggleNegotiationModal = () => {
    if (!sessionToken) {
      router.push("/auth/login");
      return;
    }
    fetchNegotiations();
    setIsNegotiationModalVisible(!isNegotiationModalVisible);
  };
  const onCloseModal = () => {
    setIsSecondModalVisible(false);
    fetchNegotiations();
    console.log("qua đây");
  };
  const onGuide = () => {
    router.push("/other/guide");
  };
  useEffect(() => {
    if (visible) fetchNegotiations();
  }, [visible, filter, order, amount]);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.groupButton2}>
            <Text style={styles.modalTitle}>Danh sách thương lượng</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton2}>Đóng</Text>
            </TouchableOpacity>
          </View>

          {/* Bộ lọc */}
          <Text>Bộ lọc</Text>
          <View style={styles.filterContainer}>
            <Picker
              selectedValue={filter}
              onValueChange={(value) => setFilter(value)}
              style={styles.picker}
            >
              <Picker.Item
                label="Độ hoàn thiện hồ sơ"
                value="profile_completeness"
              />
              <Picker.Item label="Giá đề xuất" value="negotiation_price" />
              <Picker.Item label="Ngày thương lượng" value="negotiation_date" />
            </Picker>

            <Picker
              selectedValue={order}
              onValueChange={(value) => setOrder(value)}
              style={styles.picker}
            >
              <Picker.Item label="Giảm dần" value="desc" />
              <Picker.Item label="Tăng dần" value="asc" />
            </Picker>
          </View>
          <Text>Số lượng</Text>
          <Picker
            selectedValue={amount}
            onValueChange={(value) => setAmount(value)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn số lượng" value="" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="15" value="15" />
          </Picker>
          {/* Danh sách */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            // <Text>Trống</Text>
            <FlatList
              data={negotiations}
              renderItem={renderNegotiationItem}
              keyExtractor={(item) => item.negotiation_id}
              contentContainerStyle={styles.flatListContainer}
              ListEmptyComponent={
                <Text>Hiện bài đăng không có thương lượng nào</Text>
              }
              style={styles.list}
            />
          )}
          <NegotiationDetailModal
            visible={isSecondModalVisible}
            onClose={onCloseModal}
            negotiationId={selectedNegotiation}
            idUser={idUser}
          />

          <View style={styles.groupButton}>
            <TouchableOpacity
              style={styles.openNe}
              onPress={toggleNegotiationModal}
            >
              <Text style={styles.closeButtonText}>Tạo thương lượng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onGuide}>
              <Text style={styles.closeButtonText}>Hướng dẫn</Text>
            </TouchableOpacity>
          </View>
          <CreateNegotiationModal
            visible={isNegotiationModalVisible}
            onClose={toggleNegotiationModal}
            idUser={idUser}
            postId={postId}
            price={price}
            type={type}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 600,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.tint,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  waring: {
    backgroundColor: "#FFD6D6",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  descWaring: {
    marginTop: 10,
    fontStyle: "italic",
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
  },
  dateButtonText: { textAlign: "center", color: "#333" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: Colors.tint,
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: { color: "white", textAlign: "center" },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  picker: {
    width: "50%",
    height: 50,
  },

  list: {
    marginTop: 10,
    flex: 1,
  },
  negotiationItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  negotiationTitle: {
    fontWeight: "bold",
  },
  groupButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupButton2: {
    flexDirection: "row",
    width: 500,
    gap: 80,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 150,
  },
  closeButton2: {
    color: "red",
  },
  openNe: {
    marginTop: 15,
    backgroundColor: Colors.tint,
    padding: 10,
    width: 150,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default NegotiationModal;
