import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { PostDataType } from "@/types";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import API_BASE_URL from "../config";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Avatar from "@/app/other/avatar";
import axios from "axios";
type Props = {
  postList: Array<PostDataType>;
};

const PostList = ({ postList }: Props) => {
  const [img, setImg] = useState<string[]>([]);
  const [imgMap, setImgMap] = useState<{ [key: string]: string[] }>({});
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
      return `${hours}:${minutes} hôm nay`;
    }

    return `${daysAgo} ngày trước`;
  };
  const fetchImgPostDetail = async (id: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/posts/${id}/images/`
      );
      const images = response.data.map(
        (item: { image: string }) => `${API_BASE_URL}${item.image}`
      );
      setImgMap((prevImgMap) => ({
        ...prevImgMap,
        [id]: images,
      }));
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  useEffect(() => {
    postList.forEach((item) => {
      fetchImgPostDetail(item.post_id);
    });
  }, [postList]);

  return (
    <View style={styles.container}>
      {postList.map((item) => (
        <Link
          href={`/post/${item.post_id}?type=approved`}
          key={item.post_id}
          asChild
        >
          <TouchableOpacity>
            <View style={styles.itemContainer}>
              <View style={styles.imageContainer}>
                {imgMap[item.post_id] && imgMap[item.post_id].length > 0 ? (
                  <View>
                    <Image
                      source={{ uri: imgMap[item.post_id][0] }}
                      style={styles.itemImg}
                    />
                    <View style={styles.overlayText}>
                      <Text style={styles.overlayTextHeader}>
                        + {imgMap[item.post_id].length}
                      </Text>
                      <MaterialIcons name="image" size={14} color="white" />
                    </View>
                  </View>
                ) : (
                  <View>
                    <Image
                      source={require("@/assets/images/background-welcome.jpg")}
                      style={styles.itemImg}
                    />
                    <View style={styles.overlayText}>
                      <Text style={styles.overlayTextHeader}>
                        + 0
                      </Text>
                      <MaterialIcons name="image" size={14} color="white" />
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.itemInfo}>
                <View style={styles.itemReactInfo}>
                  <Text style={styles.itemType}>{item.estate_type}</Text>
                  <View style={styles.itemDetailReactInfo}>
                    <FontAwesome name="heart" size={12} color={Colors.tint} />
                    <Text style={styles.itemType}>{item.reactions_count}</Text>
                    <FontAwesome name="eye" size={12} color={Colors.tint} />
                    <Text style={styles.itemType}>{item.view_count}</Text>
                  </View>
                </View>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.itemDetailInfo}>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price)}
                  </Text>
                  <Text style={styles.itemArea}>{item.area} m²</Text>
                  <Text style={styles.itemDetailInfo}>{item.sale_status}</Text>
                </View>
                <View style={styles.itemSourceInfo}>
                  <View style={styles.itemSourceInfoFix}>
                    <Image
                      source={{uri : item.user.avatar_url}}
                      style={styles.itemSourceImg}
                    />

                    <Text style={styles.itemSourceName}>
                      {item.user.username}
                    </Text>
                  </View>
                  <Text style={styles.itemSourceDate}>
                    {formatDate(item.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
};

export default PostList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 30,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 5,
    paddingVertical: 8,
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  itemImg: {
    width: 110,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  itemInfo: {
    display: "flex",
    gap: 10,
    width: "64%",
  },
  imageContainer: {
    position: "relative",
  },
  overlayText: {
    position: "absolute",
    bottom: 10,
    right: 10,
    color: "white",
    flexDirection: "row",
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
  },
  overlayTextHeader: {
    fontSize: 10,
    color: "white",
  },
  itemReactInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 80,
  },
  itemSourceInfoFix: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
    marginRight: 5,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.black,
  },
  itemDetailInfo: {
    flexDirection: "row",
    gap: 5,
  },
  itemPrice: {
    color: Colors.tint,
  },
  itemArea: {
    color: Colors.tint,
  },
  itemSourceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    alignItems: "center",
    width: "100%",
  },
  itemSourceImg: {
    width: 20,
    height: 20,
    borderRadius: 20,
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
