import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAppContext } from "../../AppProvider";
import API_BASE_URL from "../../config";
import { PostDataType } from "@/types";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const CommonPage = () => {
  const { id, sessionToken } = useAppContext();
  const { type } = useLocalSearchParams();

  const [data, setData] = useState<{ title: string } | null>(null);
  const [posts, setPosts] = useState<PostDataType[]>([]);

  const formatPrice = (price: string): string => {
    const priceNum = parseFloat(price);
    const priceInBillion = priceNum / 1_000_000_000;
    return `${priceInBillion.toFixed(1)} tỷ`;
  };

  const formatDate = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - createdDate.getTime();
    const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysAgo < 1) {
      const hours = createdDate.getHours().toString().padStart(2, "0");
      const minutes = createdDate.getMinutes().toString().padStart(2, "0");
      return `Đăng ${hours}:${minutes} hôm nay`;
    }

    return `Đăng ${daysAgo} ngày trước`;
  };

  useEffect(() => {
    if (type) {
      fetchData(type);
    }
  }, [type]);

  const fetchData = async (type: any) => {
    let apiUrl;
    let pageTitle = "";
    switch (type) {
      case "approved":
        apiUrl = `${API_BASE_URL}/api/posts/${id}/`;
        pageTitle = "Bài đăng đã được duyệt";
        break;
      case "pending":
        apiUrl = `${API_BASE_URL}/api/pending-posts/${id}/`;
        pageTitle = "Bài đăng đang chờ duyệt";
        break;
      case "saved":
        apiUrl = `${API_BASE_URL}/api/saved-posts/${id}/`;
        pageTitle = "Bài đăng đã lưu";
        break;
      case "negotiation":
        apiUrl = `${API_BASE_URL}/api/user-negotiations/?type=negotiator`;
        pageTitle = "Bài đăng đã tham gia thương lượng";
        break;
      case "negotiationS":
        apiUrl = `${API_BASE_URL}/api/user-negotiations/?type=negotiator`;
        pageTitle = "Bài đăng đã thương lượng thành công";
        break;
      default:
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      const result = await response.json();
      if (type === "negotiationS") {
        const filteredNegotiations = result.filter(
          (post) => post.status === "đã cọc"
        );
        setPosts(filteredNegotiations);
      } else {
        if (Array.isArray(result)) {
          setPosts(result);
        } else {
          console.error("API result is not an array:", result);
          setPosts([]);
        }
      }

      setData({ title: pageTitle });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subtitle}>{data?.title}</Text>
      {posts.map((item: any) => (
        <Link
          href={`/post/${item.post_id}?type=${type}`}
          key={item.post_id}
          asChild
        >
          <TouchableOpacity>
            <View style={styles.itemContainer}>
              <Image
                source={require("@/assets/images/background-welcome.jpg")}
                style={styles.itemImg}
                resizeMode="cover"
              />
              <View style={styles.itemInfo}>
                <View style={styles.itemReactInfo}>
                  <Text style={styles.itemType}>{item.estate_type}</Text>
                  {(type === "approved" || type === "saved") && (
                    <View style={styles.itemDetailReactInfo}>
                      <FontAwesome name="heart" size={12} color={Colors.tint} />
                      <Text style={styles.itemType}>
                        {item.reactions_count}
                      </Text>
                      <FontAwesome name="eye" size={12} color={Colors.tint} />
                      <Text style={styles.itemType}>{item.view_count}</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={styles.itemTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
                <View style={styles.itemDetailInfo}>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price)}
                  </Text>
                  <Text style={styles.itemArea}>{item.area} m²</Text>
                  <Text style={styles.itemDetailStatus}>
                    {item.sale_status}
                  </Text>
                </View>
                <View style={styles.itemSourceInfo}>
                  <Image
                    source={require("@/assets/images/background-welcome.jpg")}
                    style={styles.itemSourceImg}
                    resizeMode="cover"
                  />
                  <Text style={styles.itemSourceName}>
                    {item.user.username}
                  </Text>
                  <Text style={styles.itemSourceDate}>
                    {formatDate(item.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
};

export default CommonPage;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    textAlign: "left",
    width: "95%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
    padding: 5,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  itemImg: {
    width: 110,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    gap: 10,
  },
  itemReactInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDetailReactInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  itemType: {
    fontSize: 12,
    color: Colors.darkGrey,
    textTransform: "capitalize",
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.black,
  },
  itemDetailInfo: {
    flexDirection: "row",
    gap: 10,
  },
  itemPrice: {
    color: Colors.tint,
  },
  itemArea: {
    color: Colors.tint,
  },
  itemDetailStatus: {
    color: Colors.darkGrey,
  },
  itemSourceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemSourceImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  itemSourceName: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.darkGrey,
  },
  itemSourceDate: {
    fontSize: 10,
    fontWeight: "400",
    color: Colors.darkGrey,
  },
});
