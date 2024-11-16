import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useAppContext } from "../../AppProvider";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { UserProfile } from "@/types";
import axios from "axios";

export default function TabFourScreen() {
  const {
    id,
    name,
    role,
    sessionToken,
    setSessionToken,
    setRole,
    setId,
    setName,
  } = useAppContext();

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get<UserProfile>(
          `http://172.20.10.3:8000/auth/users/${id}`
        );
        setProfileUser(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostDetail();
  }, [id]);
  const handleLogout = () => {
    // Xử lý đăng xuất
    setSessionToken(null);
    setRole(null);
    setId(null);
    setName(null);
    Alert.alert("Đăng xuất thành công!");
  };

  if (sessionToken) {
    return (
      <View style={styles.container}>
        {/* Hiển thị avatar, tên người dùng và các thông tin */}
        <View style={styles.userInfo}>
          <Image
            style={styles.avatar}
            source={require("@/assets/images/background-welcome.jpg")}
          />
          <View style={styles.topInfo}>
            <Text style={styles.userName}>{profileUser?.fullname}</Text>
            <Text style={styles.userAccount}>Tài khoản: {name}</Text>
            <Text style={styles.desc}>Chi tiết</Text>
          </View>
          {/* <Text>{profileUser?.fullname}</Text> */}
        </View>
        <Text style={styles.subTitle}>Cài đặt</Text>
        {/* Thông tin cá nhân */}
        <View style={styles.bodyContent}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => router.push("")}
        >
          <Text style={styles.listText}>Bảo mật thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => router.push("")}
        >
          <Text style={styles.listText}>Điều khoản sử dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => router.push("")}
        >
          <Text style={styles.listText}>Cài đặt thông báo</Text>
        </TouchableOpacity>

        </View>
        <Text style={styles.subTitle}>Trợ giúp</Text>
        {/* Thông tin cá nhân */}
        <View style={styles.bodyContent}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => router.push("")}
        >
          <Text style={styles.listText}>Trung tâm trợ giúp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => router.push("")}
        >
          <Text style={styles.listText}>Về chúng tôi</Text>
        </TouchableOpacity>
               
               
        </View>
        {/* Nút đăng xuất */}
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.txtLogout}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
        <Text style={styles.message}>Hãy đăng nhập tài khoản của bạn</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.actionButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.actionButtonText}>Đăng ký</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
  },
  userInfo: {
    width: "95%",
    margin: 20,
    display: "flex",
    flexDirection: "row",
    alignItems:'center',
    gap: 20,
    backgroundColor:'white',
    padding:10,
    borderRadius:16
  },
  authContainer:{
    flex: 1,
    alignItems: "center",
    justifyContent:'center',
    width:'95%',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 10,
  },
  subTitle:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'left',
    width:'95%',
    margin:10
  },
  topInfo:{
    display:'flex',
    gap:8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userAccount: {
    fontSize: 16,
    color: "#666",
  },
  desc:{
    fontSize: 12,
    opacity:0.6,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  actionButton: {
    padding: 10,
    backgroundColor: Colors.tint,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },

  listItem: {
    paddingVertical: 15, 
    paddingLeft:10
  },
  listText: {
    fontSize: 16,
    color: "#333", 
  },
  bodyContent:{
    width:'95%',
    borderRadius:16,
    backgroundColor:'white',

  },
  btnLogout:{
   width:'95%',
   padding:20,
    borderWidth: 1, 
    borderColor: "red", 
    borderRadius:999,
    textAlign:'center',
    marginTop:20
  },
  txtLogout:{
    color:'red',
    textAlign:'center'
  }
});
