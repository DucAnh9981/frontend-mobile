import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppContext } from "../../AppProvider";
import API_BASE_WS from "../../config";
import API_BASE_URL from "../../config";
import axios from "axios";
import { useRouter } from "expo-router";
import { NegotiationData, UserAvatar } from "@/types";
import Avatar from "@/app/other/avatar";
import { Colors } from "@/constants/Colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import { useAsyncStorage } from "@react-native-async-storage/async-storage";
interface Message {
  message_id: string;
  sender: string;
  sender_username: string;
  sender_avatar: string;
  content: string;
  created_at: string;
}

const MessageDetail = () => {
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
  const { id: chatroomId, neId } = useLocalSearchParams<{ id: string }>();
  const { getItem, setItem } = useAsyncStorage("negotiationsData");
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataNe, setDataNe] = useState<NegotiationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userNe, setUserNe] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [userData, setUserData] = useState<UserAvatar | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [negotiationId, setNegotiationId] = useState("");
  const formatDate = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - createdDate.getTime();

    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(timeDifference / (1000 * 3600));
    const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (minutesAgo < 1) {
      return `Vừa xong`;
    }

    if (minutesAgo < 60) {
      return `${minutesAgo} phút trước`;
    }

    if (hoursAgo < 24) {
      return `${hoursAgo} giờ trước`;
    }

    return `${daysAgo} ngày trước`;
  };
  const formatDateToDayMonth = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };
  useEffect(() => {
    const wsUrl = `${API_BASE_WS}/ws/chat/${chatroomId}/?user_id=${id}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data.messages)) {
        const formattedMessages = data.messages.map((msg: any) => ({
          message_id: msg.message_id,
          sender: msg.sender,
          sender_username: msg.sender_username,
          sender_avatar: `${API_BASE_URL}${msg.sender_avatar}`,
          content: msg.content,
          created_at: msg.created_at,
        }));
        setMessages(formattedMessages);
      } else if (data.message) {
        const singleMessage = {
          message_id: data.message.message_id,
          sender: data.message.sender,
          sender_username: data.sender_username,
          sender_avatar: `${API_BASE_URL}${data.sender_avatar}`,
          content: data.message.content,
          created_at: data.message.created_at,
        };

        setMessages((prevMessages) => [singleMessage, ...prevMessages]);
      }
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket closed.");

    return () => {
      ws.close();
    };
  }, [id, chatroomId]);

  useEffect(() => {
    const getNegotiationIdByChatroomId = async (chatroomId: string) => {
      try {
        const storedData = await getItem();

        if (storedData) {
          const negotiationsData = JSON.parse(storedData);
          const found = negotiationsData.find(
            (item: { chatroomId: string }) => item.chatroomId === chatroomId
          );
          if (found) {
            setNegotiationId(found.negotiationId);
          }
        }
        return null;
      } catch (error) {
        return null;
      }
    };
    getNegotiationIdByChatroomId(chatroomId);
  }, [neId, getItem, setItem]);
  const getValue = (value: any, defaultValue = "Đang trống") => {
    return value !== null && value !== "" ? value : defaultValue;
  };
  const handleUserPress = () => {
    console.log("Nhấn vào thông tin người dùng!");
  };
  const handleOptionPress = (option: any) => {
    setModalVisible(false);
    if (option === "info") {
      console.log("Xem thông tin");
    } else if (option === "report") {
      console.log("Báo cáo");
    }
  };
  const fetchNegotiationData = async () => {
    setUserNe("");
    if (negotiationId) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/negotiations/${negotiationId}/`,
          {
            method: "GET",
          }
        );
        const result: NegotiationData = await response.json();
        setDataNe(result);
        setUserNe(result.user.user_id);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && wsRef.current) {
      const messageData = {
        message: newMessage,
      };
      wsRef.current.send(JSON.stringify(messageData));
      setNewMessage("");
    }
  };
  const [isVisible2, setIsVisible2] = useState(false);

  const handlePress = () => {
    setIsVisible2(!isVisible2);
  };
  const clickNe = () => {
    fetchNegotiationData();
    setIsModalVisible(true);
  };
  const onClose = async () => {
    console.log("đóng thương lượng");
    const url = `${API_BASE_URL}/api/accept-negotiations/`;
    const payload = {
      negotiation_id: negotiationId,
      "is_accepted": false,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Bạn đã từ chối thương lượng này");
        router.push("/(tabs)/post");
      }
    } catch (error) {}
  };
  const onCloseDelete = async () => {
    console.log("đóng thương lượng");
    const url = `${API_BASE_URL}/api/post-negotiations/${negotiationId}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (response.ok) {
        alert("Bạn đã xóa thương lượng này");
        router.push("/(tabs)/post");
      }
    } catch (error) {}
  };
  const onAccept = async () => {
    console.log("đồng ý");
    const url = `${API_BASE_URL}/api/accept-negotiations/`;
    const payload = {
      negotiation_id: negotiationId,
      is_accepted: true,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Bạn đã đồng ý thương lượng này");
        router.push("/(tabs)/post");
      }
    } catch (error) {}
  };
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === id;

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.otherMessage,
        ]}
      >
        {!isUser && (
          <View style={styles.avatar}>
            {item.sender_avatar ? (
              <Image
                source={{ uri: item.sender_avatar }}
                style={styles.userAvatar}
              />
            ) : (
              <Avatar name={item.sender_username} />
            )}
            {isVisible2 && (
              <Text style={styles.extraContent}>
                {formatDateToDayMonth(item.created_at)}
              </Text>
            )}
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.timeText}>{formatDate(item.created_at)}</Text>
        </View>

        {isUser && (
          <View style={styles.avatar}>
            {item.sender_avatar ? (
              <Image
                source={{ uri: item.sender_avatar }}
                style={styles.userAvatar}
              />
            ) : (
              <Avatar name={item.sender_username} />
            )}
            {isVisible2 && (
              <Text style={styles.extraContent}>
                {formatDateToDayMonth(item.created_at)}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={[styles.chatContainer]}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => clickNe()}>
          <Text style={styles.smallButton}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.subTitle}>Chi tiết thương lượng</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.userInfo}>
              <TouchableOpacity
                onPress={handleUserPress}
                style={styles.userContainer}
              >
                <Image
                  source={require("@/assets/images/background-welcome.jpg")}
                  style={styles.userAvatar}
                />
                <View>
                  <Text style={styles.userName}>
                    {getValue(dataNe?.user.username)}
                  </Text>
                  <Text style={styles.userFullname}>
                    {getValue(dataNe?.user.fullname)}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.userActive}>
                <MaterialIcons
                  onPress={() => handleOptionPress("info")}
                  name="person"
                  size={25}
                  color="black"
                />
                <MaterialIcons
                  onPress={() => handleOptionPress("report")}
                  name="flag"
                  size={25}
                  color="black"
                />
              </View>
            </View>
            <ScrollView style={styles.fieldScrollView}>
              <Text style={styles.field}>
                <Text style={styles.label}>Giá thương lượng:</Text>{" "}
                {dataNe?.negotiation_price.toLocaleString()} VND
              </Text>
              <Text style={styles.field}>
                <Text style={styles.label}>Ngày hẹn giao dịch:</Text>{" "}
                {dataNe?.negotiation_date}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.label}>Phương thức thanh toán:</Text>{" "}
                {dataNe?.payment_method}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.label}>Ghi chú:</Text>{" "}
                {dataNe?.negotiation_note}
              </Text>
            </ScrollView>
            {dataNe?.user.user_id === id ? (
              <View style={styles.acctionButton}>
               
                <TouchableOpacity style={styles.reButton} onPress={onCloseDelete}>
                  <Text style={styles.closeButtonText}>Xóa thượng lượng</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.acctionButton}>
                 <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={onAccept}
                >
                  <Text style={styles.acceptButtonText}>
                    Đồng ý thương lượng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>Đóng thượng lượng</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  chatContainer: {
    padding: 10,
    marginBottom: 100,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
  },
  userBubble: {
    backgroundColor: "#0078fe",
    borderBottomRightRadius: 0,
    marginLeft: 10,
  },
  otherBubble: {
    backgroundColor: Colors.darkGrey,
    borderBottomLeftRadius: 0,
    marginRight: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  timeText: {
    fontSize: 12,
    color: "#d3d3d3",
    marginTop: 5,
    textAlign: "right",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#0078fe",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  extraContent: {
    fontSize: 12,
    color: Colors.lightGrey,
    marginTop: 5,
  },

  smallButton: {
    fontSize: 20,
    color: "#007bff",
    width: 20,
    margin: 10,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "red",
    textAlign: "right",
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "right",
  },
  modalContent: {
    borderRadius: 10,
    flexDirection: "column",
    width: "100%",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userActive: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userFullnameTop: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.lightGrey,
  },
  userFullname: {
    fontSize: 14,
    color: Colors.lightGrey,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    width: "100%",
    color: Colors.tint,
  },
  fieldScrollView: {
    height: 130,
  },
  field: {
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
  },
  acceptButton: {
    marginTop: 20,
    width: 180,
    height: 43,
    backgroundColor: Colors.tint,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  acctionButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reButton: {
    marginTop: 20,
    width: 180,
    height: 43,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MessageDetail;
