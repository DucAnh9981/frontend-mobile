import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  Alert,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import {
  CommentPostInterface,
  PostDataType,
  PostImage,
  UserAvatar,
} from "@/types";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Loading from "@/components/Loading";
import { useAppContext } from "@/AppProvider";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import API_BASE_URL from "../../config";
import NegotiationModal from "@/components/NegotiationModal";
import SlideShowImgPost from "@/components/SlideShowImgPost";
import { Link, useRouter } from "expo-router";
import Avatar from "@/app/other/avatar";

const PostDetail = () => {
  const {
    id: idOwner,
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

  const { id, type } = useLocalSearchParams<{ id: string; type: string }>(); // lấy id từ Link
  const [post, setPost] = useState<PostDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleSave, setModalVisibleSave] = useState(false);
  const [comments, setComments] = useState<CommentPostInterface[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNegotiationModalVisible, setIsNegotiationModalVisible] =
    useState(false);
  const [modalOpacity] = useState(new Animated.Value(0));
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);
  const [isSave, setIsSaved] = useState(false);
  const [img, setImg] = useState<string[]>([]);
  const [newAvatar, setNewAvatar] = useState<UserAvatar | null>(null);
  const [modalVisible2, setModalVisible2] = useState(false);
console.log(id);
  const [error, setError] = useState<string | null>(null);
  const checkLikeStatus = async (index: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (response.status === 200) {
        setIsLiked(false);
      } else if (response.status === 201) {
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái like:", error);
    }
  };
  useEffect(() => {
    const checkStatusSequentially = async () => {
      await checkLikeStatus(1);
      await checkLikeStatus(2);
      fetchPostDetail();
    };
    checkStatusSequentially();
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PostDataType>(
          `${API_BASE_URL}/api/posts/${id}`
        );
        setPost(response.data);
        fetchImgUserData(response.data.user.user_id);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImgPostDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/posts/${id}/images/`
        );
        const images = response.data.map(
          (item: { image: string }) => `${API_BASE_URL}${item.image}`
        );
        setImg(images);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchImgUserData = async (id: string) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/auth/users-avatar/${id}/`
        );
        if (!response.data) {
          throw new Error(`Lỗi: ${response.status}`);
        }
        setNewAvatar(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchImgPostDetail();
    }
  }, [id]);

  const handleFavorite = async () => {
    if (!sessionToken) {
      router.push("/auth/login");
      return;
    }
    if (!post) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (response.status === 200) {
        setIsLiked(false);
        setPost((prevPost) =>
          prevPost
            ? {
                ...prevPost,
                reactions_count: prevPost.reactions_count - 1,
              }
            : prevPost
        );
      } else if (response.status === 201) {
        setIsLiked(true);
        setPost((prevPost) =>
          prevPost
            ? {
                ...prevPost,
                reactions_count: prevPost.reactions_count + 1,
              }
            : prevPost
        );
      } else {
        console.error(
          "API phản hồi trạng thái không mong đợi:",
          response.status
        );
      }
    } catch (error) {
      console.error("Lỗi khi gọi API like/unlike:", error);
    }
  };

  const handleUserPress = () => {
    console.log("Nhấn vào thông tin người dùng!");
    setModalVisible2(true);
  };

  const formatPrice = (price: string): string => {
    const priceNum = parseFloat(price);
    const priceInBillion = priceNum / 1_000_000_000;
    return `${priceInBillion.toFixed(1)} tỷ`;
  };
  const toggleNegotiationModal = () => {
    if (!sessionToken) {
      router.push("/auth/login");
      return;
    }
    setIsNegotiationModalVisible(!isNegotiationModalVisible);
  };
  const formatDate = (date: string): string => {
    const createdDate = new Date(date);
    return createdDate.toLocaleDateString("vi-VN");
  };
  const formatRelativeTime = (date: string): string => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - targetDate.getTime()) / 1000
    );
    if (diffInSeconds <= 0) {
      return `0 giây trước`;
    }
    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  };

  const getValue = (value: any, defaultValue = "Trống") => {
    return value !== null && value !== "" ? value : defaultValue;
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/posts/${id}/comments/`
      );
      console.log(id);
      if (response) {
        const comments = response.data;
        const updatedComments = await Promise.all(
          comments.map(async (comment: any) => {
            try {
              const userId = comment.user_id;
              console.log(userId);
              const avatarResponse = await axios.get(
                `${API_BASE_URL}/auth/users-avatar/${userId}`
              );

              if (avatarResponse && avatarResponse.data) {
                comment.avatar_url = avatarResponse.data.avatar_url;
              }
            } catch (error) {
              console.error(
                `Error fetching avatar for user ${comment.user.user_id}:`,
                error
              );
            }

            return comment;
          })
        );
        setComments(updatedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const postComment = async () => {
    if (!sessionToken) {
      router.push("/auth/login");
      return;
    }
    if (!commentText.trim()) {
      alert("Nội dung bình luận không được để trống.");
      return;
    }

    const requestBody = {
      post_id: id,
      user_id: setId,
      comment: commentText,
    };

    try {
      await axios.post(
        `${API_BASE_URL}/api/posts/${id}/comments/`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
    }
  };
  const handleReplyComment = (item: any) => {
    console.log("Trả lời comment:", item);
  };

  const handleReportComment = (item: any) => {
    console.log("Báo cáo comment:", item);
  };
  const toggleModal = () => {
    if (!isModalVisible) fetchComments();
    setIsModalVisible(!isModalVisible);

    Animated.timing(modalOpacity, {
      toValue: isModalVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleOptionPress = (option: any) => {
    setModalVisible(false);
    if (option === "info") {
      console.log("Xem thông tin");
    } else if (option === "report") {
      console.log("Báo cáo");
    }
  };
  const handleOptionSavePress = async (option: any) => {
    setModalVisibleSave(false);
    if (option === "save") {
      if (!sessionToken) {
        router.push("/auth/login");
        return;
      }
      if (!post) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/saved-posts/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const result = await response.json();
        if (response.status === 400) {
          if (
            result.detail === "Bạn không thể tự lưu bài đăng của chính mình"
          ) {
            Alert.alert("Bạn không thể tự lưu bài đăng của chính mình.");
          } else if (result.detail === "Bài đã được lưu") {
            Alert.alert("Bài viết đã được lưu trước đó!");
            setIsSaved(true);
          } else {
            console.error("Lỗi không xác định:", result.detail);
            Alert.alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
          }
        }
      } catch (error) {
        console.error("Lỗi khi gọi API like/unlike:", error);
      }
    } else if (option === "reportPost") {
      console.log("Báo cáo bài đăng");
      if (!sessionToken) {
        router.push("/auth/login");
        return;
      }
      console.log("Đã nhấn vào icon 🚩");
    }
  };
  if (loading) {
    return (
      <View>
        <Loading size="large" color={Colors.tint} />
      </View>
    );
  }

  if (!post) {
    return (
      <View>
        <Loading size="large" color={Colors.tint} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={() => setModalVisibleSave(true)}
          style={styles.iconContainer}
        >
          <FontAwesome name="ellipsis-h" size={20} color="white" />
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleSave}
          onRequestClose={() => setModalVisibleSave(false)}
        >
          <Pressable
            style={styles.modalSaveOverlay}
            onPress={() => setModalVisibleSave(false)}
          >
            <View style={styles.modalSaveSmallContent}>
              <TouchableOpacity
                onPress={() => handleOptionSavePress("save")}
                style={styles.modalOption}
              >
                <View style={styles.modalText}>
                  <FontAwesome
                    name="bookmark"
                    size={20}
                    style={styles.iconStyle}
                  />
                  <Text style={styles.textStyle}>Lưu bài viết</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOptionSavePress("reportPost")}
                style={styles.modalOption}
              >
                <View style={styles.modalText}>
                  <FontAwesome name="flag" size={15} style={styles.iconStyle} />
                  <Text style={styles.textStyle}>Báo cáo bài viết</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
      <View style={styles.imageContainer}>
        {img.length > 0 ? (
          <SlideShowImgPost img={img} />
        ) : (
          <Image
            source={require("@/assets/images/background-welcome.jpg")}
            style={styles.itemImg}
          />
        )}
      </View>
      <View style={styles.topContent}>
        <Link href={`/user/${post.user.user_id}`} asChild>
          <TouchableOpacity
            onPress={handleUserPress}
            style={styles.userContainer}
          >
            <Image
              source={{ uri: newAvatar?.avatar_url }}
              style={styles.userAvatar}
            />
            <View>
              <Text style={styles.userName}>
                {getValue(post.user.username)}
              </Text>
              <Text style={styles.userFullname}>
                {getValue(post.user.fullname)}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.iconContainer}
        >
          <MaterialIcons name="more-vert" size={25} color="black" />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalSmallContent}>
              <Link href={`/user/${post.user.user_id}`} asChild>
                <TouchableOpacity
                  onPress={() => handleOptionPress("info")}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalText}>Xem thông tin</Text>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity
                onPress={() => handleOptionPress("report")}
                style={styles.modalOption}
              >
                <Text style={styles.modalText}>Báo cáo</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
      <Text style={styles.date}>
        Ngày đăng: {formatDate(getValue(post.created_at))}
      </Text>
      <Text style={styles.titlePost}>{getValue(post.title)}</Text>
      <View style={styles.topInfo}>
        <Text style={styles.price}>{formatPrice(getValue(post.price))}</Text>
        <Text style={styles.price}> {getValue(post.area)} m²</Text>
        <Text style={styles.price}>{getValue(post.sale_status)}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.details}>Địa chỉ : {getValue(post.address)}</Text>
        <View style={styles.subInfo}>
          <Text style={styles.description2}>Quận : {getValue(post.district)}</Text>
          <Text style={styles.description2}>Phường : {getValue(post.ward)}</Text>
        </View>
        <Text style={styles.description}>Thành phố : {getValue(post.city)}</Text>

        <Text style={styles.details}>Hướng: {getValue(post.orientation)}</Text>
        {post.estate_type === "Nhà" ? (
          <View>
            <View style={styles.subInfo}>
              <Text style={styles.description}>
                Số tầng : {getValue(post.floor)}
              </Text>
              <Text style={styles.description}>
                Mặt tiền : {getValue(post.frontage)}
              </Text>
            </View>
            <View style={styles.subInfo}>
              <Text style={styles.description}>
                Chiều dài : {getValue(post.length)}
              </Text>
              <Text style={styles.description}>
                Chiều rộng : {getValue(post.width)}
              </Text>
            </View>
            <View style={styles.subInfo}>
              <Text style={styles.description}>
                Số phòng ngủ : {getValue(post.bedroom)}
              </Text>
              <Text style={styles.description}>
                Số phòng tắm : {getValue(post.bathroom)}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.subInfo}>
              <Text style={styles.description}>
                Mặt tiền : {getValue(post.frontage)}
              </Text>
            </View>
            <View style={styles.subInfo}>
              <Text style={styles.description}>
                Chiều dài : {getValue(post.length)}
              </Text>
              <Text style={styles.description}>
                Chiều rộng : {getValue(post.width)}
              </Text>
            </View>
          </View>
        )}
        <Text style={styles.descriptionSub}>
          Tình trạng pháp lý :{getValue(post.legal_status)}
        </Text>
        <Text style={styles.descriptionSub}>Mô tả : {post.description}</Text>
      </ScrollView>
      {(type === "approved" || type === "saved" || type === "negotiation") && (
        <View style={styles.actions}>
          <View style={styles.subIconInfo}>
            <View style={styles.iconsInfo}>
              <TouchableOpacity onPress={handleFavorite}>
                <FontAwesome
                  name="heart"
                  size={20}
                  color={isLiked ? "red" : "black"}
                />
              </TouchableOpacity>
              <Text>{post.reactions_count} lượt thích</Text>
            </View>
            <View style={styles.iconsInfo}>
              <FontAwesome name="comment" size={20} />
              <Text onPress={toggleModal}>{post.comments_count} bình luận</Text>
            </View>
          </View>
          {idOwner === post.user.user_id ? (
            <View style={styles.actionInfo}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleNegotiationModal}
              >
                <Text style={styles.actionButtonText}>Thương lượng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/post/EditPost?postId=${id}`)}
              >
                <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionInfo}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleNegotiationModal}
              >
                <Text style={styles.actionButtonText}>Thương lượng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleModal}
              >
                <Text style={styles.actionButtonText}>Bình luận</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <NegotiationModal
        visible={isNegotiationModalVisible}
        onClose={toggleNegotiationModal}
        idUser={post.user.user_id}
        postId={id}
        price={post.price}
        type={type}
      />
      <Modal animationType="slide" visible={isModalVisible} transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => {
            toggleModal();
          }}
        >
          <Animated.View
            style={[styles.modalBackground, { opacity: modalOpacity }]}
          >
            <TouchableWithoutFeedback onPressIn={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.commentAuthor}>Bình luận trước đó</Text>
                <FlatList
                  data={comments}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                      <View style={styles.commentSubItem}>
                        <View>
                          {item.avatar_url ? (
                            <Image
                              source={{ uri: item.avatar_url }}
                              style={styles.userAvatar}
                            />
                          ) : (
                            <Avatar name={item.fullname || item.username} />
                          )}
                        </View>
                        <View style={styles.commentContainer}>
                          <Text style={styles.commentAuthor}>
                            {item.fullname || item.username}
                          </Text>
                          <Text style={styles.commentContent}>
                            {item.comment}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                          style={styles.actionButtonPost}
                          onPress={() => handleReplyComment(item)}
                        >
                          <Text style={styles.actionButtonTextPost}>
                            {formatRelativeTime(item.created_at)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButtonPost}
                          onPress={() => handleReplyComment(item)}
                        >
                          <Text style={styles.actionButtonTextPost}>
                            Trả lời
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButtonPost}
                          onPress={() => handleReportComment(item)}
                        >
                          <Text style={styles.actionButtonTextPost}>
                            Báo cáo
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
                <View style={styles.commentInputContainer}>
                  <TextInput
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder="Viết bình luận..."
                    style={styles.commentInput}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={postComment}
                  >
                    <FontAwesome name="send" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    position: "relative",
  },
  itemImg: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    resizeMode: "cover",
  },
  iconsInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  subIconInfo: {
    display: "flex",
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  iconsContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 5,
    zIndex: 1,
    gap: 10,
  },
  actionInfo: {
    display: "flex",
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textIcon: {
    position: "absolute",
    width: 15,
    height: 15,
    textAlign: "center",
    lineHeight: 15,
    backgroundColor: "red",
    borderRadius: 100,
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
    top: "-10%",
    right: 20,
  },
  topContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  userAvatarComment: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userFullname: {
    fontSize: 14,
    color: Colors.lightGrey,
  },
  date: {
    fontSize: 14,
    color: Colors.lightGrey,
    marginHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    height: 400,
    marginBottom: 100,
    color: "black",
  },
  titlePost: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  topInfo: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    gap: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  subInfo: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    gap: 10,
    fontSize: 16,

  },
  price: {
    fontSize: 18,
    color: Colors.tint,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "black",
    lineHeight: 24,
    width: "50%",
  },
  description2: {
    fontSize: 16,
    color: "black",
    lineHeight: 24,
  },
  descriptionSub: {
    fontSize: 16,
    color: "black",
    lineHeight: 24,
  },
  details: {
    fontSize: 16,
    marginTop: 10,
    color: "black",
  },
  actions: {
    flexDirection: "column",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  actionButton: {
    backgroundColor: Colors.tint,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    height: 500,
    maxHeight: "50%",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: Colors.tint,
    borderRadius: 20,
    padding: 10,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.tint,
  },
  closeButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  commentItem: {
    flexShrink: 1,
    alignSelf: "flex-start",

    marginBottom: 20,
  },
  commentSubItem: {
    flexShrink: 1,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  commentContainer: {
    backgroundColor: "#f0f2f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 10,
    maxWidth: 280,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#222",
  },
  commentContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    marginBottom: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 20,
    marginLeft: 58,
  },
  actionButtonPost: {},
  actionButtonTextPost: {
    fontSize: 12,
  },
  iconContainer: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: -50,
  },
  modalSaveOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 110,
  },
  modalSmallContent: {
    width: "38%",
    backgroundColor: Colors.white,
    textAlign: "left",
    borderRadius: 10,
    right: 10,
    maxHeight: "50%",
    borderColor: Colors.darkGrey,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalSaveSmallContent: {
    width: "50%",
    backgroundColor: Colors.white,
    textAlign: "left",
    borderRadius: 10,
    right: 10,
    maxHeight: "50%",
    borderColor: Colors.darkGrey,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalText: {
    fontSize: 16,
    textAlign: "left",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconStyle: {
    marginRight: 5,
  },
  textStyle: {
    fontSize: 16,
  },
});
