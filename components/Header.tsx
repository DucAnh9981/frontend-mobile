import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/AppProvider";
import { router, useLocalSearchParams } from "expo-router";
import API_BASE_WS from "../config";
import { Video } from "expo-av";
import LottieView from "lottie-react-native";
const Header = () => {
  const { id, name, fullname, sessionToken } = useAppContext();
  const [numberNo, setNumberNo] = useState(0);
  useEffect(() => {
    if (sessionToken) {
      const ws = new WebSocket(
        `${API_BASE_WS}/ws/notifications/?user_id=${id}`
      );

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNumberNo(data.count);
      };

      return () => {
        ws.close();
      };
    }
  }, []);
  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Chào buổi sáng";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Chào buổi chiều";
    } else {
      return "Chào buổi tối";
    }
  };
  const handleMessagePress = () => {
    if (!sessionToken) {
      router.push("/auth/login");
      return;
    }
    router.push("/user/message");
  };

  // Hàm xử lý khi nhấn vào icon thông báo
  const handleNotificationPress = () => {
    if (!sessionToken) {
      router.push("/auth/login");
      return;
    }
    router.push("/user/notification");
  };
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.userInfoDetail}>
          {sessionToken ? (
            <>
              <Image
                source={require("@/assets/images/Logo.png")}
                style={styles.logo}
                resizeMode="cover"
              />
              <View>
                <Text style={styles.welcomeTxt}>{getGreetingMessage()}</Text>
                <Text style={styles.userName}>{name}</Text>
              </View>
            </>
          ) : (
            <>
              <View>
                <Text style={styles.welcomeTxt}>
                  Chào mừng đến với SweetHome
                </Text>
                <Text style={styles.notLoggedIn}>Bạn chưa đăng nhập</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.subHeader}>
        <TouchableOpacity
          style={styles.notifi}
          onPress={handleNotificationPress}
        >
          <View style={styles.countno}>
            <Text style={styles.textno}>
              {numberNo > 10 ? "10+" : numberNo}
            </Text>
          </View>
          <LottieView
            source={require("@/assets/images/bell-icon.json")}
            autoPlay
            loop
            style={styles.notifiIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.notifi} onPress={handleMessagePress}>
          <View style={styles.countno}>
            <Text></Text>
          </View>
          <LottieView
            source={require("@/assets/images/message-icon.json")}
            autoPlay
            loop
            style={styles.messageIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  logo: {
    width: 50,
    height: 30,
  },
  subHeader: {
    flexDirection: "row",
    gap: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userInfoDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notifi: {
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  notifiIcon: {
    position: "relative",
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  messageIcon: {
    position: "relative",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  countno: {
    position: "absolute",
    top: 3,
    right: 0,
    backgroundColor: Colors.tint,
    borderRadius: 50,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex:100,
  },
  textno: {
    fontSize: 8,
    color:"white"
  },
  countmes: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 50,
    width: 10,
    height: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarUser: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  welcomeTxt: {
    fontSize: 14,
    color: Colors.tint,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
  },
  notLoggedIn: {
    fontSize: 12,
    fontStyle: "italic",
    color: Colors.darkGrey,
  },
});
