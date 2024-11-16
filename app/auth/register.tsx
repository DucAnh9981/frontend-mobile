import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import Divider from "../../components/Divider"; 
import { Colors } from "@/constants/Colors";

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
          // Thực hiện API call đăng ký
          const response = await fetch("http://172.20.10.3:8000/auth/register/", {
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
          console.log('Response Data:', data);
          if (response.ok) {
            router.replace("/auth/registration-success");
          } else {
            setError(data.message || "Đã tồn tại người dùng có tên đăng nhập này");
          }
        } catch (error) {
          console.log(error);
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
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
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
      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Đăng ký</Text>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
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
    backgroundColor: Colors.tint,
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
    color: Colors.tint,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default RegisterPage;
