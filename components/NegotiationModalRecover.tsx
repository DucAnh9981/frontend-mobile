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
import NegotiationDetailModal from "@/components/NegotiationDetailModal";
interface NegotiationModalRecoverProps {
  visible: boolean;
  onClose: () => void;
  negotiationId: string;
}

const NegotiationModalRecover: React.FC<NegotiationModalRecoverProps> = ({
  visible,
  onClose,
  negotiationId,
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
  const [selectedNegotiation, setSelectedNegotiation] = useState(""); // Lưu thông tin của item được nhấn
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    if (!offerPrice.trim() || !startDate || !transactionMethod.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
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
        `${API_BASE_URL}/api/send-proposal/${negotiationId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            proposal_price: offerPrice,
            proposal_date: formatDate(startDate),
            proposal_method: transactionMethod,
            proposal_note: notes,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Thành công", "Đề nghị đã được gửi lại thành công!");
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
//   const fetchNegotiations = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/post-negotiations/${postId}/?sort_by=${filter}&order=${order}&amount=${amount}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${sessionToken}`,
//           },
//         }
//       );

//       // Kiểm tra nếu response không thành công
//       if (!response.ok) {
//         console.error("API Error:", response.status, response.statusText);
//         Alert.alert("Lỗi", "Không thể tải danh sách thương lượng.");
//         return;
//       }

//       // Parse JSON từ response
//       const data = await response.json();
//       console.log("Dữ liệu từ API:", data);

//       // Cập nhật state nếu có dữ liệu
//       setNegotiations(data.negotiations || []);
//       console.log("data", negotiations);
//     } catch (error) {
//       console.error("Error fetching negotiations:", error);
//       Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
//     } finally {
//       setIsLoading(false); // Kết thúc loading
//     }
//   };

//   const renderNegotiationItem = ({ item }: { item: any }) => {
//     console.log("Rendering item:", item);
//     return (
//       <TouchableOpacity
//         style={styles.negotiationItem}
//         onPress={() => {
//           setSelectedNegotiation(item.negotiation_id);
//           setIsSecondModalVisible(true);
//         }}
//       >
//         <Text style={styles.negotiationTitle}>
//           Giá đề xuất: {item.negotiation_price}
//         </Text>
//         <Text>
//           Ngày thương lượng:{" "}
//           {new Date(item.negotiation_date).toLocaleDateString()}
//         </Text>
//         <Text>Phương thức: {item.payment_method}</Text>
//         <Text>Ghi chú: {item.negotiation_note || "Không có"}</Text>
//       </TouchableOpacity>
//     );
//   };
//   useEffect(() => {
//     if (visible) fetchNegotiations();
//   }, [visible, filter, order, amount]);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thương lượng</Text>

            {/* Giá đề nghị */}
            <TextInput
              style={styles.input}
              placeholder="Nhập giá đề nghị"
              keyboardType="numeric"
              value={offerPrice}
              onChangeText={setOfferPrice}
            />
            {/* Ngày bắt đầu */}
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Ngày bắt đầu: {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setStartDate(date);
                }}
              />
            )}

            {/* Phương thức giao dịch */}
            <Picker
              selectedValue={transactionMethod}
              onValueChange={(itemValue: any) =>
                setTransactionMethod(itemValue)
              }
              style={styles.input}
            >
              <Picker.Item label="Trả một lần" value="một lần" />
              <Picker.Item label="Trả góp" value="trả góp" />
              <Picker.Item label="Khác" value="khác" />
            </Picker>

            {/* Ghi chú */}
            <TextInput
              style={styles.textArea}
              placeholder="Ghi chú (nếu có)"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {/* Nút hành động */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
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
    height: 500,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
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
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
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
  closeButton: {
    marginTop: 15,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default NegotiationModalRecover;
