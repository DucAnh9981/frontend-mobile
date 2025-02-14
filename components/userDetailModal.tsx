import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import API_BASE_URL from "../config";
import { Colors } from "@/constants/Colors";
import { UserProfile } from "@/types";
import Avatar from "@/app/other/avatar";

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  idUser: string;
}

const UserDetailModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  idUser,
}) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  // Fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/users/${idUser}/`);
      setUserData(response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu người dùng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && idUser) {
      fetchUserData();
    }
  }, [visible, idUser]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.tint} />
          ) : userData ? (
            <ScrollView>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {userData.avatar ? ( <Image
                  source={{
                    uri: `${API_BASE_URL}${userData.avatar}`,
                  }}
                  style={styles.avatar}
                />):(
                    <Avatar name={userData.user.username}/>
                )}
               
              </View>

              {/* Thông tin cơ bản */}
              <Text style={styles.name}>{userData.fullname}</Text>

              {/* Thông tin chi tiết */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  📧 Email: {userData.user.email}
                </Text>
                <Text style={styles.infoText}>
                  📱 Số điện thoại: {userData.phone_number}
                </Text>
                <Text style={styles.infoText}>
                  🎂 Ngày sinh: {userData.birthdate}
                </Text>
                <Text style={styles.infoText}>🏙️ Thành phố: {userData.city}</Text>
                <Text style={styles.infoText}>🧑 Giới tính: {userData.gender}</Text>
                <Text style={styles.infoText}>
                  ⭐ Điểm uy tín: {userData.reputation_score}
                </Text>
                <Text style={styles.infoText}>
                  💼 Giao dịch thành công: {userData.successful_transactions}
                </Text>
                <Text style={styles.infoText}>
                  🔄 Tỷ lệ phản hồi: {userData.response_rate}%
                </Text>
                <Text style={styles.infoText}>
                  📊 Hoàn thiện hồ sơ: {userData.profile_completeness}%
                </Text>
                <Text style={styles.infoText}>
                  🤝 Kinh nghiệm thương lượng: {userData.negotiation_experience}
                </Text>
              </View>

              {/* Nút đóng */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <Text style={styles.errorText}>Không có dữ liệu người dùng</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  role: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.lightGrey,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    overflow:"hidden"
  },
  closeButton: {
    backgroundColor: Colors.tint,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
  },
});

export default UserDetailModal;
