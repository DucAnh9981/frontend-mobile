import { NegotiationData, ReNegotiationData } from "@/types";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
} from "react-native";
import { useAppContext } from "@/AppProvider";
import { Colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import API_BASE_URL from "../config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NegotiationModalRecover from "@/components/NegotiationModalRecover";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
const DetailNeRe = ({
  visible,
  onClose,
  negotiationId,
  idUser,
}: {
  visible: boolean;
  onClose: () => void;
  negotiationId: string;
  idUser: string;
}) => {
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
  const [data, setData] = useState<ReNegotiationData | null>(null); // Áp dụng interface
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isPostOwner = idUser === currentUserId;
  console.log("id ne : ", negotiationId);
  const { getItem, setItem } = useAsyncStorage("negotiationsData");
  const [negotiationId2, setNegotiationId2] = React.useState<string | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [isNegotiationModalVisible, setIsNegotiationModalVisible] =
    useState(false);
  useEffect(() => {
    const fetchNegotiationData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/negotiation-proposal/${negotiationId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        const result: ReNegotiationData = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) fetchNegotiationData();
  }, [visible, negotiationId, sessionToken]);

  if (loading) {
    return (
      <Modal visible={visible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    );
  }
  const toggleNegotiationModal = () => {
    setIsNegotiationModalVisible(!isNegotiationModalVisible);
  };
  const getValue = (value: any, defaultValue = "Đang trống") => {
    return value !== null && value !== "" ? value : defaultValue;
  };
  const handleUserPress = () => {
    console.log("Nhấn vào thông tin người dùng!");
  };
  const handleOptionPress = (option: any) => {
    setModalVisible(false);
    if (option === "info") {
      console.log("Xem thông tin");
      // Thực hiện hành động "Xem thông tin"
    } else if (option === "report") {
      console.log("Báo cáo");
      // Thực hiện hành động "Báo cáo"
    }
  };
  const onAccept = async () => {
    console.log("Đồng ý");
  };

  const onRe = () => {
    console.log("Gửi lại");
    toggleNegotiationModal();
  };
  const onReNe = () => {
    console.log("Danh sách gửi lại");
    toggleNegotiationModal();
  };
  const onCloseNe = async () => {
    console.log("Đóng thương lượng");
    toggleNegotiationModal();
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/post-negotiations/${negotiationId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      console.log("del", response);
      if (response) {
        Alert.alert("Đóng thương lượng thành công");
      }
    } catch (error) {}
  };
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.groupHeader}>
              <Text style={styles.title}>Chi tiết thương lượng</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButtonText2}>Đóng</Text>
              </TouchableOpacity>
            </View>
            {data?.proposals && data.proposals.length > 0 ? (
              data.proposals.map((proposal) => (
                <View key={proposal.proposal_id}>
                  <Text style={styles.subTitle}>Thông tin thương lượng</Text>
                  <ScrollView style={styles.fieldScrollView}>
                    <Text style={styles.field}>
                      <Text style={styles.label}>Giá thương lượng:</Text>{" "}
                      {proposal.proposal_price.toLocaleString()} VND
                    </Text>
                    <Text style={styles.field}>
                      <Text style={styles.label}>Ngày hẹn giao dịch:</Text>{" "}
                      {proposal.proposal_date}
                    </Text>
                    <Text style={styles.field}>
                      <Text style={styles.label}>Phương thức thanh toán:</Text>{" "}
                      {proposal.proposal_method}
                    </Text>
                    <Text style={styles.field}>
                      <Text style={styles.label}>Ghi chú:</Text>{" "}
                      {proposal.proposal_note}
                    </Text>
                  </ScrollView>
                  <View style={styles.acctionButton}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={onAccept}
                    >
                      <Text style={styles.reButtonText}>Đồng ý</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reButton} onPress={onRe}>
                      <Text style={styles.reButtonText}>Yêu cầu lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={onClose}
                    >
                      <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                Hiện không có thông tin thương lượng nào.
              </Text>
            )}
          </View>
        </View>
      </GestureHandlerRootView>
      <NegotiationModalRecover
        visible={isNegotiationModalVisible}
        onClose={toggleNegotiationModal}
        negotiationId={negotiationId}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginVertical: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userActive: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userFullnameTop: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.lightGrey,
  },
  userFullname: {
    fontSize: 14,
    color: Colors.lightGrey,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.tint,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "black",
  },
  fieldScrollView: {
    height: 130,
  },
  field: {
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    width: 100,
    height: 43,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    marginTop: 20,
    width: 100,
    height: 43,
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  reButton: {
    marginTop: 20,
    width: 100,
    height: 43,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  reButton2: {
    marginTop: 20,
    width: 150,
    height: 43,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  reButton3: {
    marginTop: 20,
    width: 150,
    height: 43,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "red",
    fontWeight: "bold",
  },
  reButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButtonText2: {
    color: "red",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: -50,
    // right:10
  },
  iconContainer: {
    padding: 5,
  },
  modalSmallContent: {
    width: "38%",
    backgroundColor: Colors.white,
    textAlign: "left",
    borderRadius: 10,
    right: 10,
    maxHeight: "50%",
    borderColor: Colors.darkGrey,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalText: {
    fontSize: 16,
    textAlign: "left",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  waring: {
    backgroundColor: "#FFD6D6",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 10,
  },
  acctionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DetailNeRe;
