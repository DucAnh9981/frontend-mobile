import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import API_BASE_WS from "../../config";
import { router, useLocalSearchParams } from "expo-router";
import { useAppContext } from "../../AppProvider";
import Avatar from "@/app/other/avatar";
interface NotificationItem {
  notification_id: string;
  description: string;
  is_read: boolean;
  data: {
    created_at: string;
    additional_info: {
      type: string;
      post_id: string;
      author_id: string;
      author_avatar: string;
      negotiator_avatar: string;
    };
  };
}

const Notification = () => {
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${API_BASE_WS}/ws/notifications/?user_id=${id}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.count);
      if (data.type === "all_notifications") {
        setNotifications(data.notifications);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleOptions = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={styles.notificationContainer}>
      {item.data.additional_info.author_avatar ||
      item.data.additional_info.negotiator_avatar ? (
        <Image
          source={{
            uri: `${API_BASE_WS}${
              item.data.additional_info.author_avatar ??
              item.data.additional_info.negotiator_avatar
            }`,
          }}
          style={styles.avatar}
        />
      ) : (
        <Avatar name={item.description} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{item.data.created_at}</Text>
      </View>
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => handleOptions(item)}
      >
        <Text style={styles.optionsText}>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.notification_id}
        contentContainerStyle={styles.listContainer}
      />
      {modalVisible && selectedNotification && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  Alert.alert(
                    "Đánh dấu là đã đọc",
                    `${selectedNotification.description} marked as read.`
                  );
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Đánh dấu là đã đọc</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  Alert.alert(
                    "Báo cáo",
                    `${selectedNotification.description} has been reported.`
                  );
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Báo cáo</Text>
              </TouchableOpacity>
              <Pressable
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  listContainer: {
    padding: 10,
  },
  notificationContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
  },
  optionsButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  optionsText: {
    fontSize: 18,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#0078fe",
    alignItems: "center",
    marginVertical: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#aaa",
  },
});

export default Notification;
