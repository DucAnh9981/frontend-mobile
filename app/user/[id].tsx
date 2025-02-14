import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { UserAvatar, UserProfile } from "@/types";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Colors } from "@/constants/Colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "@/AppProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import API_BASE_URL from "../../config";
import Avatar from "@/app/other/avatar";
import { useFetchUserData } from "../../hooks/avatarUsser";
const UserDetail = () => {
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
  const { id: profileUserId } = useLocalSearchParams<{ id: string }>();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [newAvatar, setNewAvatar] = useState<UserAvatar | null>(null);
  const [newAvatarSe, setNewAvatarSe] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { userDataHook, fetchUserDataHook } = useFetchUserData();
  console.log("token", currentUserId);
  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };
  const onChange = (
    event: { type: string },
    selectedData: Date | undefined
  ) => {
    if (event.type === "set") {
      const currentDate = selectedData || date;
      setDate(currentDate);

      const formattedDate = currentDate.toISOString().split("T")[0];
      handleInputChange("birthdate", formattedDate);
      setShowPicker(false);
    } else {
      setShowPicker(false);
    }
  };
  const [image, setImage] = useState();
  const [formData, setFormData] = useState({
    fullname: "",
    city: "",
    birthdate: "",
    phone_number: "",
    gender: "",
  });
  console.log(profileUserId);
  const isCurrentUser = currentUserId === profileUserId;
  useEffect(() => {
    if (profileUserId) {
      fetchUserData(profileUserId);
      fetchImgUserData(profileUserId);
      setNewAvatarSe(false);
    }
  }, [profileUserId]);

  const fetchUserData = async (profileUserId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/auth/users/${profileUserId}/`
      );
      if (!response.data) {
        throw new Error(`Lỗi: ${response.status}`);
      }
      console.log(response.data);
      setUserData(response.data);
      console.log(userData?.avatar);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };
  const fetchImgUserData = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/auth/users-avatar/${id}/`
      );
      if (!response.data) {
        throw new Error(`Lỗi: ${response.status}`);
      }
      setNewAvatar(response.data);
      console.log(newAvatar?.avatar_url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const updateUser = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/users/${profileUserId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Alert.alert("Thành công", "Thông tin đã được cập nhật!");
        setModalVisible(false);
        fetchUserData(profileUserId);
      } else {
        const errorData = await response.json();
        Alert.alert("Lỗi", errorData.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối với server.");
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | null
  ) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleEdit = () => {
    if (userData) {
      setFormData({
        fullname: userData.fullname || "",
        city: userData.city || "",
        birthdate: userData.birthdate || "",
        phone_number: userData.phone_number || "",
        gender: userData.gender || "",
      });
    }
    setModalVisible(true);
  };
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Lỗi: {error}</Text>
      </View>
    );
  }

  const selectImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Bạn cần cấp quyền truy cập vào thư viện ảnh!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const response = await fetch(imageUri);
        const blob = await response.blob();

        const file = {
          uri: imageUri,
          name: "avatar.jpeg",
          type: blob.type,
        };

        setSelectedFile(file);
        setNewAvatarSe(true);
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh.");
    }
  };

  const uploadAvatar = async () => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }
      console.log("selectedFile", selectedFile);
      const response = await axios.post(
        `${API_BASE_URL}/auth/users-avatar/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Avatar updated successfully:", response.data);
        Alert.alert("Thành công", "Ảnh đại diện được tải lên thành công!");
        fetchImgUserData(currentUserId);
        setImage(response.data.avatar_url);
        setNewAvatarSe(false);
        fetchUserDataHook(currentUserId);
      } else {
        Alert.alert("Lỗi", "Tải ảnh đại diện thất bại!");
      }
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Lỗi", "Tải ảnh đại diện thất bại.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.coverImageContainer}>
      <Image
          source={require("@/assets/images/background-welcome.jpg")}
          style={styles.coverImage}
        />
        <View style={styles.overlay}>
          <View style={styles.statContainer}>
            <Text style={styles.statText}>
              Điểm uy tín: {userData?.reputation_score}
            </Text>
            <Text style={styles.statText}>
              Giao dịch thành công: {userData?.successful_transactions}
            </Text>
            <Text style={styles.statText}>
              Tỷ lệ phản hồi: {userData?.response_rate}%
            </Text>
            <Text style={styles.statText}>
              Hoàn thiện hồ sơ: {userData?.profile_completeness}%
            </Text>
            <Text style={styles.statText}>
              Kinh nghiệm giao dịch: {userData?.negotiation_experience}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.userInfoContainer}>
        <TouchableOpacity onPress={selectImage}>
          {newAvatar?.avatar_url ? (
            <Image
              source={{ uri: newAvatar?.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <Avatar name={userData?.fullname || userData?.user} />
          )}
        </TouchableOpacity>
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>
            {userData?.fullname || "Tên người dùng"}
          </Text>
        </View>
        {newAvatarSe && (
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={uploadAvatar}
          >
            <Text style={styles.editButtonText}>Lưu</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.subTitle}>Thông tin cá nhân</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.label}>Giới tính</Text>
          <Text style={styles.value}>
            {userData?.gender || "Chưa cập nhật"}
          </Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.label}>Ngày sinh</Text>
          <Text style={styles.value}>
            {userData?.birthdate || "Chưa cập nhật"}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.label}>Quê quán</Text>
          <Text style={styles.value}>{userData?.city || "Chưa cập nhật"}</Text>
        </View>
        <View style={styles.itemInfoLast}>
          <Text style={styles.label}>Điện thoại</Text>
          <View>
            <Text style={styles.value}>
              {userData?.phone_number || "Chưa cập nhật"}
            </Text>
            {isCurrentUser && (
              <Text style={styles.subValue}>
                Hãy cập nhật số điện thoại chính xác để thuận tiện cho việc giao
                dịch , tương tác
              </Text>
            )}
          </View>
        </View>
        {isCurrentUser && (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={16} color={"white"} />
            <Text style={styles.editButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.label}>Họ và tên:</Text>
            <TextInput
              style={styles.input}
              value={formData.fullname}
              onChangeText={(text) => handleInputChange("fullname", text)}
            />
            <Text style={styles.label}>Giới tính</Text>
            <TextInput
              style={styles.input}
              value={formData.gender}
              onChangeText={(text) => handleInputChange("gender", text)}
            />
            <Text style={styles.label}>Quê quán:</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => handleInputChange("city", text)}
            />
            <Text style={styles.label}>Ngày sinh:</Text>
            <Pressable onPress={toggleDatepicker}>
              <TextInput
                style={styles.input}
                value={formData.birthdate}
                editable={false}
              />
            </Pressable>
            {showPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
              />
            )}
            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput
              style={styles.input}
              value={formData.phone_number}
              onChangeText={(text) => handleInputChange("phone_number", text)}
            />
            <TouchableOpacity style={styles.updateButton} onPress={updateUser}>
              <Text style={styles.updateButtonText}>Cập nhật</Text>
            </TouchableOpacity>

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

export default UserDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -95,
    marginLeft: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userNameContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoContainer: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: "white",
  },
  itemInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 10,
  },
  itemInfoLast: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    paddingVertical: 10,
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    width: "30%",
  },
  value: {
    fontSize: 16,
    color: "black",
  },
  subValue: {
    fontSize: 13,
    color: "#555",
    width: "50%",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  editImageButton: {
    width: 50,
    marginLeft: 20,
    backgroundColor: "#007BFF",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay
    borderRadius: 10,
    width: "100%",

  },
  statContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
    width: "100%",
    marginTop:10
  },
  statText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    // textAlign: "center",
  },
  error: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
    // textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#FF5733",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
