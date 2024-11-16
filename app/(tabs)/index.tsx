import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SlideShow from "@/components/SlideShow";
import Categories from "@/components/Categories";
import PostList from "@/components/PostList";
import axios from "axios";
import { PostDataType } from "@/types";
import { isLoading } from "expo-font";
import Loading from "@/components/Loading";
type Props = {};

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();
  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const onCatChanged = (category: string) => {
    console.log("C", category);
  };
  const fetchPopularPosts = async (category:string = '') => {
    try {
      let categoryString= '';
      if(category.length !== 0 ){
        categoryString = `?category=${category}`;
      }
      const response = await axios.get(
        `http://172.20.10.3:8000/api/posts/${categoryString}`
      );
      if (response && response.data) {
        console.log(response.data);
        setPosts(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching popular posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularPosts();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar />
      {loading ? <Loading size={"large"} /> : <SlideShow />}

      <Categories onCategoryChanged={onCatChanged} />
      {loading ? <Loading size={"large"} /> : <PostList postList={posts} />}
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
