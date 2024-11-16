import React, { useState, useContext } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAppContext } from "../../AppProvider";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setSessionToken, setRole, setId, setName } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch("http://172.20.10.3:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSessionToken(data.tokens.access);
        setRole(data.role);
        const role = data.role;
        await AsyncStorage.setItem("refreshToken", data.tokens.refresh);

        if (data.data && role === "admin") {
          setName(data.data.username);
          setId(data.data.user_id);
        } else if (data.data && role === "user") {
          setName(data.data.user.username);
          setId(data.data.user_id);
        } else {  
          setError("Dữ liệu người dùng không hợp lệ");
          return;
        }
        if (role === "admin") {
          router.replace("/(tabs)");
        } else if (role === "user") {
          router.replace("/(tabs)");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      handleError(error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };
  function handleError(err: any) {
    console.error(err);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setError(null);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text);
          setError(null);
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(tabs)")}>
        <Text style={styles.linkText}>Quay lại trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: "#3CA9F9",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    textAlign: "center",
    marginTop: 10,
    color: "#3CA9F9",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default LoginPage;
