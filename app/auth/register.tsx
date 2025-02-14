import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Text,
  View,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import Divider from "../../components/Divider";
import { Colors } from "@/constants/Colors";
import API_BASE_URL from "../../config";

const RegisterPage = () => {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (email && password && confirmPassword) {
      if (password === confirmPassword) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: {
                email,
                username: user,
                password,
                role: "user",
              },
            }),
          });
          const data = await response.json();
          if (response.ok) {
            router.replace("/auth/registration-success");
          } else {
            setError(
              data.message || "Đã tồn tại người dùng có tên đăng nhập này"
            );
          }
        } catch (error) {
          setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } else {
        Alert.alert("Mật khẩu không khớp");
      }
    } else {
      setError("Vui lòng điền đầy đủ thông tin");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/images/background-14.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerBackground}>
              <Text style={styles.title}>SweetHome xin chào</Text>
              <Text style={styles.desc}>Hãy đăng ký tài khoản</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            value={user}
            onChangeText={(text) => {
              setUser(text);
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
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            secureTextEntry
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError(null);
            }}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.divider}>
            <Divider />
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleRegister}>
            <Text style={styles.btnText}>Đăng ký</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.linkText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
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
    shadowColor: "black",
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
  divider: {
    width: "30%",
    marginHorizontal: "auto",
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
  linkText: {
    marginTop: 10,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default RegisterPage;
