import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import { PostDataType } from '@/types';
import { Colors } from '@/constants/Colors';
import SearchBar from './SearchBar';  // Import SearchBar
import PostList from './PostList';  // Import PostList
import axios from 'axios';
import API_BASE_URL from "../config";

const SearchPage = () => {
  const [postList, setPostList] = useState<PostDataType[]>([]);
  const [loading, setLoading] = useState(false);

  // Hàm gọi API tìm kiếm
  const fetchPostsSearch = async (searchText: string) => {
    if (searchText === '') {
      setPostList([]);  // Clear list if search is empty
      return;
    }

    setLoading(true); 
    try {
      const response = await axios.get(`${API_BASE_URL}/api/search/?text=${searchText}`);
      setPostList(response.data); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={fetchPostsSearch} />  
       
      {loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : (
        <PostList postList={postList} />  // Hiển thị danh sách bài đăng
      )}
    </View>
  );
};

export default SearchPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.darkGrey,
  },
});
