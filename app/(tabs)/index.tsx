import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SlideShow from "@/components/SlideShow";
import Categories from "@/components/Categories";
import PostList from "@/components/PostList";
import axios from "axios";
import { PostDataType } from "@/types";
import Loading from "@/components/Loading";
import API_BASE_URL from "../../config";
import { Colors } from "@/constants/Colors";

type Props = {};

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();
  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const onCatChanged = (category: string) => {
    fetchPopularPosts(category);
  };

  const fetchPopularPosts = async (category: string = "") => {
    setLoading(true);
    try {
      let categoryString = "";
      if (category.length !== 0) {
        categoryString = `?category=${category}`;
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/posts/${categoryString}`,
        {
          headers: {
            'Content-Type': 'application/json',

          }
        }
      );
      if (response && response.data) {
        const posts = response.data;
        const updatedPosts = await Promise.all(
          posts.map(async (post: any) => {
            try {
              const userId = post.user.user_id;
              const avatarResponse = await axios.get(
                `${API_BASE_URL}/auth/users-avatar/${userId}`
              );

              if (avatarResponse && avatarResponse.data) {
                post.user.avatar_url = avatarResponse.data.avatar_url;
              }
            } catch (error) {
              console.error(
                `Error fetching avatar for user ${post.user.user_id}:`,
                error
              );
            }

            return post;
          })
        );

        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error("Error fetching popular posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (searchText: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/search/?text=${searchText}`
      );
      if (response && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularPosts();
  }, []);

  return (
    <ScrollView style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar onSearch={fetchPosts} />
      <SlideShow />
      <Text style={styles.subTitle}>Danh sách bài đăng</Text>
      <Categories onCategoryChanged={onCatChanged} />
      {loading ? <Loading size={"large"} /> : <PostList postList={posts} />}
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    marginLeft: 20,
  },
});
