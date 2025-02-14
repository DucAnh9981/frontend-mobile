import React from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const AuthNoToken = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/background-14.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.authContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>SweetHome xin chào</Text>
            <Text style={styles.desc}>Bạn cần đăng nhập để tiếp tục</Text>
          </View>
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
    </ImageBackground>
  );
};

export default AuthNoToken;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  background: {
    flex: 1,
  },
  header: {
    marginBottom: 300,
    marginLeft: 15,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.tint,
    fontStyle: "italic",
  },
  desc: {
    fontSize: 18,
    color: "black",
    fontStyle: "italic",
    fontWeight: "bold",

  },
  authContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
  },
  actionButton: {
    padding: 15,
    backgroundColor: Colors.tint,
    borderRadius: 999,
    marginVertical: 10,
    width: "95%",
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
});
