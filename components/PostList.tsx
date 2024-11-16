import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { PostDataType } from "@/types";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";

type Props = {
  postList: Array<PostDataType>;
};

const PostList = ({ postList }: Props) => {
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

    return `Đăng ${daysAgo} ngày trước`;
  };

  return (
    <View style={styles.container}>
      {postList.map((item) => (
        <Link href={`/post/${item.post_id}`} key={item.post_id} asChild>
          <TouchableOpacity>
            <View style={styles.itemContainer}>
            <Image
  source={require("@/assets/images/background-welcome.jpg")}
  style={styles.itemImg}
/>
              <View style={styles.itemInfo}>
                <Text style={styles.itemType}>{item.estate_type}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.itemDetailInfo}>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price)}
                  </Text>
                  <Text style={styles.itemArea}>{item.area} m²</Text>
                  <Text style={styles.itemDetailInfo}>{item.sale_status}</Text>
                </View>
                <View style={styles.itemSourceInfo}>
                  <Image
                    source={require("@/assets/images/background-welcome.jpg")}
                    style={styles.itemSourceImg}
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
    </View>
  );
};

export default PostList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flex: 1,
    gap: 10,
  },
  itemImg: {
    width: 90,
    height: 100,
    borderRadius: 20,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    gap: 10,
    justifyContent: "space-between",
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
  itemSourceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
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
