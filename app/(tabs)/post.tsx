import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Link, useRouter } from "expo-router";
import { useAppContext } from "../../AppProvider";
import axios from "axios";
import { PostDataType } from "@/types";
import Loading from "@/components/Loading";
import { Colors } from "@/constants/Colors";
import AuthNoToken from "@/app/other/authNoToken";

type Props = {};

const Post = (props: Props) => {
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
  const { top: safeTop } = useSafeAreaInsets();
  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {}, []);
  if (sessionToken) {
    return (
      <View style={[styles.container, { paddingTop: safeTop }]}>
        <Header />
        <Text style={styles.subtitle}>Tạo bài đăng</Text>
        <View style={styles.bodyContent}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/post/createPost")}
          >
            <Text style={styles.listText}>Tạo bài đăng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("")}
          >
            <Text style={styles.listText}>Hướng dẫn</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Bài đăng của bạn</Text>
        <View style={styles.bodyContent}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/post/commonPage?type=approved")}
          >
            <Text style={styles.listText}>Bài đăng được duyệt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/post/commonPage?type=pending")}
          >
            <Text style={styles.listText}>Bài đăng chờ duyệt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/post/commonPage?type=saved")}
          >
            <Text style={styles.listText}>Bài đăng đã lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/post/commonPage?type=negotiation")}
          >
            <Text style={styles.listText}>Bài đăng đã thương lượng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/post/commonPage?type=negotiationS")}
          >
            <Text style={styles.listText}>Bài đăng thương lượng thành công</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <AuthNoToken />;
  }
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    width: "100%",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    marginLeft: 20,
    textAlign: "left",
    width: "95%",
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
    margin: 10,
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
});
