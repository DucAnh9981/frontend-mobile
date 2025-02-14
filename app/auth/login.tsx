import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAppContext } from "../../AppProvider";
import API_BASE_URL from "../../config";
import { Colors } from "@/constants/Colors";
import Divider from "@/components/Divider";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setSessionToken, setRole, setId, setName, setFullname } =
    useAppContext();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSessionToken(data.tokens.access);
        setRole(data.role);
        const role = data.role;
        await AsyncStorage.setItem("refreshToken", data.tokens.refresh);
        if (data.data && role === "admin") {
          setName(data.data.username);
          setFullname(data.data.fullname);
          setId(data.data.user_id);
        } else if (data.data && role === "user") {
          setName(data.data.user.username);
          setFullname(data.data.fullname);
          setId(data.data.user_id);
        } else {
          setError("Dữ liệu người dùng không hợp lệ");
          return;
        }
        router.replace("/(tabs)");
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error(error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/images/background-14.jpg")} // Đặt đường dẫn ảnh nền
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
              <View style={styles.headerBackground}>
                <Text style={styles.title}>SweetHome xin chào</Text>
                <Text style={styles.desc}>Hãy đăng nhập tài khoản của bạn</Text>
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setError(null);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#ccc"
              value={password}
              secureTextEntry
              onChangeText={(text) => {
                setPassword(text);
                setError(null);
              }}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.divider}>
              <Divider />
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
              <Text style={styles.btnText}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={styles.groupLinkText}>
              <Text style={styles.linkText}>Bạn chưa có tài khoản? Hãy</Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text style={styles.linkText2}> Đăng ký</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.linkText}>Hoặc</Text>
            <TouchableOpacity
              style={styles.groupLinkText}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.linkTextSub}>Quay lại trang chủ</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  divider: {
    width: "30%",
    marginHorizontal: "auto",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  headerBackground: {
    width: "100%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.tint,
    marginBottom: 10,
    fontStyle: "italic",
  },
  desc: {
    fontSize: 18,
    color: "black",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 999,
    backgroundColor: "white",
  },
  btn: {
    backgroundColor: "#3CA9F9",
    paddingVertical: 15,
    borderRadius: 999,
    alignItems: "center",
    marginVertical: 20,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  groupLinkText: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    width: "100%",
  },
  linkTextSub: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.tint,
    fontStyle: "italic",
  },
  linkText: {
    marginTop: 10,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  linkText2: {
    marginTop: 10,
    color: Colors.tint,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default LoginPage;
