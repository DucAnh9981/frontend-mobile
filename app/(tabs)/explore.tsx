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
import SearchBar from "@/components/SearchBar";
import Categories from "@/components/Categories";
import PostList from "@/components/PostList";
import axios from "axios";
import { PostDataType } from "@/types";
import Loading from "@/components/Loading";
import { Colors } from "@/constants/Colors";
import API_BASE_URL from "../../config";
import FilterModal from "@/components/FilterPostList";
import { Ionicons } from "@expo/vector-icons";
type Props = {};

const Explore = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();
  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [originalPosts, setOriginalPosts] = useState<PostDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onApplyFilters = (filters: {
    priceRange: number[];
    saleStatus: string;
    legalStatus: string;
    district: string;
  }) => {
    const { priceRange, saleStatus, legalStatus, district } = filters;
    setPosts(originalPosts);
    setFiltering(true);
    console.log(originalPosts);

    setTimeout(() => {
      const filteredPosts = originalPosts.filter((post) => {
        const matchesPrice =
          Number(post.price) >= priceRange[0] &&
          Number(post.price) <= priceRange[1];
        const matchesSaleStatus =
          !saleStatus || post.sale_status === saleStatus;
        const matchesLegalStatus =
          !legalStatus || post.legal_status === legalStatus;
        const matchesDistrict =
          district === "Tất cả" || post.district === district;

        return (
          matchesPrice &&
          matchesSaleStatus &&
          matchesLegalStatus &&
          matchesDistrict
        );
      });
      console.log("sau khi lọc",filteredPosts);
      setPosts(filteredPosts);
      setIsModalVisible(false);
      setFiltering(false);
    }, 1000);
  };

  const fetchPopularPosts = async (category: string = "") => {
    setLoading(true);
    try {
      let categoryString = "";
      if (category.length !== 0) {
        categoryString = `?category=${category}`;
      }
      const response = await axios.get(
        `${API_BASE_URL}/api/posts/${categoryString}`
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
        setOriginalPosts(response.data);
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
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <Text style={styles.subtitle}>Danh sách bài đăng</Text>
      <SearchBar onSearch={fetchPosts} />
      <Categories onCategoryChanged={fetchPopularPosts} />
      <ScrollView>
        {loading || filtering ? (
          <Loading size={"large"} />
        ) : posts.length === 0 ? (
          <Text style={styles.emptyText}>Không có bài đăng nào</Text>
        ) : (
          <PostList postList={posts} />
        )}
      </ScrollView>
      {/* Nút FAB */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Ionicons name="search" size={20} color="white" />
      </TouchableOpacity>
      {/* Modal */}
      <FilterModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onApplyFilters={onApplyFilters}
      />
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    marginLeft: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007bff",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
  },
  fabText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
