import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useAppContext } from "../../AppProvider";
import { Link, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { UserAvatar, UserProfile } from "@/types";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import API_BASE_URL from "../../config";
import Avatar from "@/app/other/avatar";
import Header from "@/components/Header";
import { useFetchUserData } from "../../hooks/avatarUsser";
import * as ImagePicker from "expo-image-picker";
import AuthNoToken from "@/app/other/authNoToken";
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
    fullname,
    setFullname,
  } = useAppContext();

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  // const [userData, setUserData] = useState<UserAvatar | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { top: safeTop } = useSafeAreaInsets();
  const { userDataHook, fetchUserDataHook } = useFetchUserData();

  useEffect(() => {
    if (userDataHook) {
      fetchUserDataHook(id);
    }
  }, [id]);

  const handleLogout = () => {
    // Xử lý đăng xuất
    setSessionToken(null);
    setRole(null);
    setId(null);
    setName(null);
    setFullname(null);
    Alert.alert("Đăng xuất thành công!");
  };

  if (sessionToken) {
    return (
      <View style={styles.container}>
        <View style={styles.containerH}>
          <Header />
        </View>
        <Text style={styles.subTitle}>Cài đặt</Text>
        {/* Thông tin cá nhân */}
        <View style={styles.bodyContent}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push(`/user/${id}`)}
          >
            <Text style={styles.listText}>Thông tin cá nhân</Text>
          </TouchableOpacity>

        

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/other/termsOfUse")}
          >
            <Text style={styles.listText}>Điều khoản sử dụng</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("")}
          >
            <Text style={styles.listText}>Cài đặt thông báo</Text>
          </TouchableOpacity> */}
        </View>
        <Text style={styles.subTitle}>Trợ giúp</Text>
        {/* Thông tin cá nhân */}
        <View style={styles.bodyContent}>
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/other/guide")}
          >
            <Text style={styles.listText}>Hướng dẫn sử dụng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/other/helpCenter")}
          >
            <Text style={styles.listText}>Trung tâm trợ giúp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/other/aboutUs")}
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
    return <AuthNoToken />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    width: "100%",
    marginTop: 40,
  },
  containerH: {
    marginTop: 34,
  },
  userInfo: {
    width: "95%",
    margin: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 16,
  },
  authContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "95%",
    marginBottom: 10,
    marginLeft: 20,
  },
  topInfo: {
    display: "flex",
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userAccount: {
    fontSize: 16,
    color: "#666",
  },
  desc: {
    fontSize: 12,
    opacity: 0.6,
  },
  message: {
    fontSize: 16,
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
    paddingLeft: 10,
  },
  listText: {
    fontSize: 16,
    color: "#333",
  },
  bodyContent: {
    width: "95%",
    borderRadius: 16,
    backgroundColor: "white",
    marginBottom: 10,
  },
  btnLogout: {
    width: "95%",
    padding: 20,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 999,
    textAlign: "center",
    marginTop: 20,
  },
  txtLogout: {
    color: "red",
    textAlign: "center",
  },
});
