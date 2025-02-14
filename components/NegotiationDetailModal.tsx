import { NegotiationData, UserAvatar } from "@/types";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import axios from "axios";
import { useAppContext } from "@/AppProvider";
import { Colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import API_BASE_URL from "../config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NegotiationModalRecover from "@/components/NegotiationModalRecover";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import DetailNeRe from "@/components/DetailNeRe";
import Avatar from "@/app/other/avatar";
import UserDetailModal from "@/components/userDetailModal";
const NegotiationDetailModal = ({
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
  const [data, setData] = useState<NegotiationData | null>(null); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [newAvatar, setNewAvatar] = useState<UserAvatar | null>(null);
  const [newAvatarH, setNewAvatarH] = useState<UserAvatar | null>(null);
  const isPostOwner = idUser === currentUserId;
  console.log("id ne : ", negotiationId);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);

  const { getItem, setItem } = useAsyncStorage("negotiationsData");
  const [negotiationId2, setNegotiationId2] = React.useState<string | null>(
    null
  );
  const [idUserNe, setIdUserNe] = useState("");
  const [idUserNeH, setIdUserNeH] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);

  const [isNegotiationModalVisible, setIsNegotiationModalVisible] =
    useState(false);
  const fetchNegotiationData = async () => {
    setLoading(true);
    setNewAvatar(null);
    setNewAvatarH(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/negotiations/${negotiationId}/`,
        {
          method: "GET",
        }
      );
      const result: NegotiationData = await response.json();
      setIdUserNe(result.user.user_id);

      setIdUserNeH(result.highest_negotiation_user.user_id);
      await fetchImgUserData(result.user.user_id);
      await fetchImgUserHighData(result.highest_negotiation_user.user_id);
      setData(result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const fetchImgUserData = async (idUserNe: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/auth/users-avatar/${idUserNe}/`
      );
      if (!response.data) {
        throw new Error(`Lỗi: ${response.status}`);
      }
      setNewAvatar(response.data);
      console.log(newAvatar?.avatar_url);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const fetchImgUserHighData = async (idUserNeH: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/auth/users-avatar/${idUserNeH}/`
      );
      if (!response.data) {
        throw new Error(`Lỗi: ${response.status}`);
      }
      setNewAvatarH(response.data);
      console.log(newAvatar?.avatar_url);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNegotiationData();
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

  const isNeOwner = idUserNe === currentUserId;
  const toggleNegotiationModal = () => {
    setIsNegotiationModalVisible(!isNegotiationModalVisible);
  };
  const getValue = (value: any, defaultValue = "Đang trống") => {
    return value !== null && value !== "" ? value : defaultValue;
  };
  const handleUserPress = () => {
    console.log("Nhấn vào thông tin người dùng!");
    setModalVisible2(true);
  };
  const handleUserPress2 = () => {
    console.log("Nhấn vào thông tin người dùng!");
    setModalVisible3(true);
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
    const url = `${API_BASE_URL}/api/consider-negotiations/`;
    const payload = {
      negotiation_id: negotiationId,
      is_considered: true,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const chatroomId = result.chatroom.chatroom_id;

      // Lưu chatroomId và negotiationId vào AsyncStorage
      const storeNegotiationId = async (
        chatroomId: string,
        negotiationId: string
      ) => {
        try {
          // Lấy mảng đã có trong AsyncStorage
          const storedData = await getItem();
          const negotiationsData = storedData ? JSON.parse(storedData) : [];

          // Thêm đối tượng mới vào mảng
          negotiationsData.push({ chatroomId, negotiationId });

          // Lưu lại mảng vào AsyncStorage
          await setItem(JSON.stringify(negotiationsData));
        } catch (error) {
          console.error("Lỗi khi lưu vào AsyncStorage:", error);
        }
      };

      // Gọi hàm lưu thông tin vào AsyncStorage
      storeNegotiationId(chatroomId, negotiationId);

      // Chuyển hướng đến chatroom với chatroomId và negotiationId
      router.push(`/messages/${chatroomId}?neId=${negotiationId}`);
      onClose();
      alert(
        "Chúng tôi vừa tạo một chat room, bạn hãy trò chuyện với người mua để xem xét kĩ hơn nhé!"
      );

      // Đóng modal
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const onRe = () => {
    console.log("Gửi lại");
    toggleNegotiationModal();
  };
  const onReNe = () => {
    console.log("Danh sách gửi lại");
    setIsSecondModalVisible(true);
  };
  const onCloseNe = async () => {
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
      setTimeout(() => {
        onClose();
      }, 2000);
      onClose();
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
          {data ? (
            <>
              <Text style={styles.userFullnameTop}>
                Của : {getValue(data.user?.fullname)}
              </Text>
              <Text style={styles.subTitle}>Thông tin chi tiết người dùng</Text>
              <View style={styles.userInfo}>
                <TouchableOpacity onPress={handleUserPress} style={styles.userContainer}>
                  {newAvatar?.avatar_url ? (
                    <Image
                      source={{ uri: newAvatar?.avatar_url }}
                      style={styles.userAvatar}
                    />
                  ) : (
                    <Avatar name={getValue(data.user?.username)} />
                  )}
                  <View>
                    <Text style={styles.userName}>
                      {getValue(data.user?.username)}
                    </Text>
                    <Text style={styles.userFullname}>
                      {getValue(data.user?.fullname)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
  
              <Text style={styles.subTitle}>Thông tin thương lượng</Text>
              <ScrollView style={styles.fieldScrollView}>
                <Text style={styles.field}>
                  <Text style={styles.label}>Giá thương lượng:</Text> 
                  {data.negotiation_price?.toLocaleString()} VND
                </Text>
                <Text style={styles.field}>
                  <Text style={styles.label}>Ngày hẹn giao dịch:</Text> 
                  {data.negotiation_date}
                </Text>
                <Text style={styles.field}>
                  <Text style={styles.label}>Phương thức thanh toán:</Text> 
                  {data.payment_method}
                </Text>
                <Text style={styles.field}>
                  <Text style={styles.label}>Ghi chú:</Text> 
                  {data.negotiation_note}
                </Text>
              </ScrollView>
  
              <View style={styles.waring}>
                <Text>
                  <Text style={styles.label}>SweetHome</Text> cho biết, hiện tại bài đăng này đang có :
                </Text>
                <Text style={styles.field}>
                  <Text style={styles.label}>Người trả giá cao nhất là:</Text>
                </Text>
                <View style={styles.userInfo}>
                  <TouchableOpacity onPress={handleUserPress2} style={styles.userContainer}>
                    {newAvatarH?.avatar_url ? (
                      <Image
                        source={{ uri: newAvatarH?.avatar_url }}
                        style={styles.userAvatar}
                      />
                    ) : (
                      <Avatar name={getValue(data.user?.username)} />
                    )}
                    <View>
                      <Text style={styles.userName}>
                        {getValue(data.highest_negotiation_user?.username)}
                      </Text>
                      <Text style={styles.userFullname}>
                        {getValue(data.highest_negotiation_user?.fullname)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* <View style={styles.userActive}>
                    <MaterialIcons
                      onPress={() => handleOptionPress("info")}
                      name="person"
                      size={20}
                      color="black"
                    />
                    <MaterialIcons
                      onPress={() => handleOptionPress("report")}
                      name="flag"
                      size={20}
                      color="black"
                    />
                  </View> */}
                </View>
                <Text style={styles.field}>
                  <Text style={styles.label}>Với mức giá :</Text> 
                  {data.highest_negotiation_price?.toLocaleString()} VND
                </Text>
              </View>
  
              {isPostOwner ? (
                <View style={styles.acctionButton}>
                  <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                    <Text style={styles.reButtonText}>Xem xét</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reButton} onPress={onRe}>
                    <Text style={styles.reButtonText}>Yêu cầu lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              ) : isNeOwner ? (
                <View>
                  <Text>
                    Nếu như chủ bài đăng yêu cầu lại thì sẽ được hiển thị ở đây
                  </Text>
                  <View style={styles.groupHeader}>
                    <TouchableOpacity style={styles.reButton2} onPress={onReNe}>
                      <Text style={styles.reButtonText}>Chi tiết yêu cầu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reButton3} onPress={onCloseNe}>
                      <Text style={styles.closeButtonText}>Đóng thương lượng</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            <Text style={styles.errorText}>Không có dữ liệu</Text>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
    <NegotiationModalRecover
      visible={isNegotiationModalVisible}
      onClose={toggleNegotiationModal}
      negotiationId={negotiationId}
    />
    <DetailNeRe
      visible={isSecondModalVisible}
      onClose={() => setIsSecondModalVisible(false)}
      negotiationId={negotiationId}
      idUser={idUser}
    />
     <UserDetailModal
      visible={modalVisible2}
      onClose={() => setModalVisible2(false)}
      idUser={idUserNe}
    />
    <UserDetailModal
      visible={modalVisible3}
      onClose={() => setModalVisible3(false)}
      idUser={idUserNeH}
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

export default NegotiationDetailModal;
