import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import SearchMessage from '@/components/SearchMessage';
import axios from 'axios';
import { useAppContext } from "../../AppProvider";
import API_BASE_URL from "../../config";
import Avatar from '@/app/other/avatar';
interface Chatroom {
  chatroom_id: string;
  chatroom_name: string;
  participants: string[];
  is_private: boolean;
}

const MessageList = () => {
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
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/chatrooms/?user_id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        setChatrooms(response.data.data);
      } catch (error) {
        console.error('Error fetching chatrooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatrooms();
  }, []);

  const handleMessagePress = (chatroomId: string) => {
    console.log(chatroomId)
    router.push(`/messages/${chatroomId}`);
  };

  const renderItem = ({ item }: { item: Chatroom }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => handleMessagePress(item.chatroom_id)}
    >
      <Avatar name={item.chatroom_name}/>
      <View style={styles.messageContent}>
        <Text style={styles.sender}>{item.chatroom_name}</Text>
        <Text style={styles.messageText} numberOfLines={1}>
          {item.participants.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078fe" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchMessage />
      <Text style={styles.subTitle}>Tin nhắn gần đây</Text>
      <FlatList
        data={chatrooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.chatroom_id}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Không có chatroom nào.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  messageItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  messageContent: {
    marginLeft: 10,
    flex: 1,
  },
  sender: {
    fontWeight: 'bold',
  },
  messageText: {
    color: '#555',
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'left',
    width: '95%',
    margin: 10,
    paddingHorizontal: 10,
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default MessageList;
