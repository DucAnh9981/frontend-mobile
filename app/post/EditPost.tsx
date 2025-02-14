import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Card, Button, RadioButton } from "react-native-paper";
import { useAppContext } from "@/AppProvider";
import axios from "axios";
import API_BASE_URL from "../../config";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";

const EditPost = () => {
  const {
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
  const [post, setPost] = useState({
    title: "",
    estate_type: "",
    price: "",
    city: "",
    district: "",
    street: "",
    ward: "",
    address: "",
    orientation: "",
    area: "",
    length: "",
    width: "",
    frontage: "",
    bedroom: "",
    bathroom: "",
    floor: "",
    legal_status: "",
    sale_status: "",
    images: "",
    description: "",
  });
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const data = [
    {
      district: "Hải Châu",
      wards: [
        "Phường Hải Châu 1",
        "Phường Hải Châu 2",
        "Phường Thạch Thang",
        "Phường Phước Ninh",
        "Phường Nam Dương",
        "Phường Hoà Cường Bắc",
        "Phường Hoà Cường Nam",
        "Phường Hoà Thuận Đông",
        "Phường Hoà Thuận Tây",
      ],
    },
    {
      district: "Thanh Khê",
      wards: [
        "Phường Thanh Khê Đông",
        "Phường Thanh Khê Tây",
        "Phường Chính Gián",
        "Phường Xuân Hà",
        "Phường An Khê",
        "Phường Lý Nhân Tông",
        "Phường Tam Thuận",
      ],
    },
    {
      district: "Sơn Trà",
      wards: [
        "Phường Mân Thái",
        "Phường Thọ Quang",
        "Phường Phước Mỹ",
        "Phường An Hải Bắc",
        "Phường An Hải Đông",
        "Phường An Hải Nam",
        "Phường Nại Hiên Đông",
      ],
    },
    {
      district: "Ngũ Hành Sơn",
      wards: [
        "Phường Mỹ An",
        "Phường Khuê Mỹ",
        "Phường Hòa Quý",
        "Phường Hòa Hải",
        "Phường Bắc Mỹ An",
      ],
    },
    {
      district: "Liên Chiểu",
      wards: [
        "Phường Hòa Hiệp Bắc",
        "Phường Hòa Khánh Nam",
        "Phường Hòa Minh",
        "Phường Hòa Hiệp Nam",
        "Phường Hòa Khánh Bắc",
      ],
    },
    {
      district: "Cẩm Lệ",
      wards: [
        "Phường Hòa Thọ Đông",
        "Phường Hòa An",
        "Phường Hòa Phát",
        "Phường Khuê Trung",
      ],
    },
    {
      district: "Hòa Vang",
      wards: [
        "Xã Hòa Bắc",
        "Xã Hòa Liên",
        "Xã Hòa Ninh",
        "Xã Hòa Phước",
        "Xã Hòa Khương",
        "Xã Hòa Sơn",
        "Xã Hòa Tiến",
        "Xã Hòa Phước",
      ],
    },
    {
      district: "Hoàng Sa",
      wards: ["Phường Hoàng Sa"],
    },
  ];
  const orientations = [
    { label: "Bắc", value: "Bắc" },
    { label: "Nam", value: "Nam" },
    { label: "Đông", value: "Đông" },
    { label: "Tây", value: "Tây" },
    { label: "Đông Bắc", value: "Đông Bắc" },
    { label: "Đông Nam", value: "Đông Nam" },
    { label: "Tây Bắc", value: "Tây Bắc" },
    { label: "Tây Nam", value: "Tây Nam" },
  ];
  console.log(postId);
  const formatCurrencyToMillion = (amount: number) => {
    const million = amount / 1e9;
    return `${million.toFixed(3)} tỷ VND`;
  };
  const wards =
    data.find((item) => item.district === selectedDistrict)?.wards || [];

  const [price, setPrice] = useState(""); // giá trị người dùng nhập
  const [unit, setUnit] = useState(""); // đơn vị người dùng chọn
  const handleUnitChange = (unit: string) => {
    setUnit(unit); // Cập nhật đơn vị người dùng chọn // Cập nhật giá trị sau khi thay đổi đơn vị
  };
  const handlePriceChange = (value: string) => {
    const formattedValue = value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    if (formattedValue.length <= 12) {
      setPrice(formattedValue); // Cập nhật giá trị người dùng nhập
      updatePrice(formattedValue, unit); // Cập nhật giá trị sau khi nhập
    }
  };
  const updatePrice = (price: string, unit: string) => {
    // Kiểm tra xem giá trị nhập vào có phải là một số hợp lệ không
    const priceNumber = parseInt(price, 10);
    if (isNaN(priceNumber) || priceNumber === 0) {
      setPost({ ...post, price: "" }); // Nếu không phải số hợp lệ, trả lại giá trị rỗng
      return;
    }

    let value = priceNumber; // Lấy giá trị người dùng nhập
    if (unit === "trieu") {
      value = value * 1000000; // Nếu chọn triệu, nhân với 1 triệu
    } else if (unit === "ty") {
      value = value * 1000000000; // Nếu chọn tỷ, nhân với 1 tỷ
    }
    setPost({
      ...post,
      price: value.toString(), // Cập nhật giá trị sau khi tính toán
    });
  };
  useEffect(() => {
    // Fetch post data from the API
    axios
      .get(`${API_BASE_URL}/api/posts/${postId}`)
      .then((response) => {
        const formattedData = {
          ...response.data,
          area: formatInteger(response.data.area),
          length: formatInteger(response.data.length),
          width: formatInteger(response.data.width),
          frontage: formatInteger(response.data.frontage),
          price: formatInteger(response.data.price),
        };
        setPost(formattedData);
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [postId]);
  console.log(post);
  const handleChange = (value, field) => {
    setPost((prevPost) => ({ ...prevPost, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !post.title ||
      !post.estate_type ||
      !post.price ||
      !post.city ||
      !post.district ||
      !post.ward ||
      !post.address ||
      !post.orientation ||
      !post.area ||
      !post.length ||
      !post.width ||
      !post.frontage ||
      (post.estate_type === "nhà" &&
        (!post.bedroom || !post.bathroom || !post.floor)) ||
      !post.legal_status
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const response = await axios.put(
      `${API_BASE_URL}/api/posts/${postId}/`,
      post,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );
    if (response) {
      // Alert.alert(
      //   "Thông báo",
      //   "Bài đăng của bạn đã được cập nhật, chúng tôi sẽ tiến hành duyệt bài sớm nhất có thể!"
      // );
      router.push(`/post/createPostSuccess`);
    }
  };
  const formatInteger = (number) => {
    return Math.floor(number);
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Chỉnh sửa bài đăng</Text>

      <Text style={styles.subtitle}>Tiêu đề:</Text>
      <TextInput
        style={styles.input}
        value={post.title}
        onChange={(e) => handleChange(e, "title")}
      />

      <View style={styles.inputNotEdit}>
        <Text style={styles.subtitle}>Loại bất động sản:</Text>
        <Text style={styles.textNotEdit}>{post.estate_type}</Text>
      </View>

      <Text style={styles.subtitle}>Giá:(giới hạn 12 số)</Text>
      <TextInput
        value={post.price ? post.price.toString() : ""}
        onChangeText={handlePriceChange}
        style={styles.input}
        keyboardType="numeric"
        maxLength={12}
      />
      <View style={styles.groupInput}>
        <Picker
          selectedValue={unit}
          onValueChange={handleUnitChange}
          style={{ height: 60, width: 150 }}
        >
          <Picker.Item label="Đơn vị" value="" />
          <Picker.Item label="Triệu" value="trieu" />
          <Picker.Item label="Tỷ" value="ty" />
        </Picker>
        <Text>
          Giá :{" "}
          {post.price
            ? `${formatCurrencyToMillion(Number(post.price))}`
            : "Chưa có giá trị"}
        </Text>
      </View>
      <Text style={styles.subtitle}>Quận:</Text>
      <Picker
        selectedValue={selectedDistrict}
        onValueChange={(value = post.district) => {
          setSelectedDistrict(value);
          handleChange(value, "district");
          setSelectedWard("");
        }}
        style={styles.picker}
      >
        <Picker.Item label="Chọn quận" value="" />
        {data.map((item) => (
          <Picker.Item
            key={item.district}
            label={item.district}
            value={item.district}
          />
        ))}
      </Picker>

      {selectedDistrict && (
        <View>
          <Text style={styles.subtitle}>Phường :</Text>
          <Picker
            selectedValue={selectedWard}
            onValueChange={(value) => {
              setSelectedWard(value);
              handleChange(value, "ward");
            }}
            style={styles.picker}
          >
            <Picker.Item label="Chọn phường" value="" />
            {wards.map((ward, index) => (
              <Picker.Item key={index} label={ward} value={ward} />
            ))}
          </Picker>
        </View>
      )}

      <Text style={styles.subtitle}>Đường / số nhà:</Text>
      <TextInput
        style={styles.input}
        value={post.address}
        onChange={(e) => {
          e.persist();
          handleChange(e, "address");
        }}
      />
      <Text style={styles.label2}>Hướng :</Text>
      <Picker
        selectedValue={post.orientation}
        onValueChange={(itemValue) => handleChange(itemValue, "orientation")}
        style={styles.picker}
      >
        <Picker.Item label="Chọn hướng" value="" />
        {orientations.map((orientation) => (
          <Picker.Item
            key={orientation.value}
            label={orientation.label}
            value={orientation.value}
          />
        ))}
      </Picker>
      <Text style={styles.subtitle}>Hướng:</Text>
      <TextInput
        style={styles.input}
        value={post.orientation}
        onChange={(e) => handleChange(e, "orientation")}
      />

      <Text style={styles.subtitle}>Diện tích (m²):</Text>
      <TextInput
        style={styles.input}
        value={post.area ? formatInteger(post.area).toString() : ""}
        onChange={(e) => {
          const value = parseFloat(e.nativeEvent.text) || 0;
          handleChange(formatInteger(value), "area");
        }}
        keyboardType="numeric"
      />

      <Text style={styles.subtitle}>Chiều dài:</Text>
      <TextInput
        style={styles.input}
        value={post.length ? formatInteger(post.length).toString() : ""}
        onChange={(e) => {
          const value = parseFloat(e.nativeEvent.text) || 0;
          handleChange(formatInteger(value), "length");
        }}
        keyboardType="numeric"
      />

      <Text style={styles.subtitle}>Chiều rộng:</Text>
      <TextInput
        style={styles.input}
        value={post.width ? formatInteger(post.width).toString() : ""}
        onChange={(e) => {
          const value = parseFloat(e.nativeEvent.text) || 0;
          handleChange(formatInteger(value), "width");
        }}
        keyboardType="numeric"
      />

      <Text style={styles.subtitle}>Mặt tiền:</Text>
      <TextInput
        style={styles.input}
        value={post.frontage ? formatInteger(post.frontage).toString() : ""}
        onChange={(e) => {
          const value = parseFloat(e.nativeEvent.text) || 0;
          handleChange(formatInteger(value), "frontage");
        }}
        keyboardType="numeric"
      />

      {post.estate_type === "Nhà" && (
        <>
          <Text style={styles.subtitle}>Số phòng ngủ:</Text>
          <TextInput
            style={styles.input}
            value={post.bedroom ? post.bedroom.toString() : ""}
            onChange={(e) => handleChange(e, "bedroom")}
            keyboardType="numeric"
          />
          <Text style={styles.subtitle}>Số phòng tắm:</Text>
          <TextInput
            style={styles.input}
            value={post.bathroom ? post.bathroom.toString() : ""}
            onChange={(e) => handleChange(e, "bathroom")}
            keyboardType="numeric"
          />

          <Text style={styles.subtitle}>Số tầng:</Text>
          <TextInput
            style={styles.input}
            value={post.floor ? post.floor.toString() : ""}
            onChange={(e) => handleChange(e, "floor")}
            keyboardType="numeric"
          />
        </>
      )}

      <Text style={styles.subtitle}>Tình trạng pháp lý:</Text>
      <RadioButton.Group
        onValueChange={(value) => handleChange(value, "legal_status")}
        value={post.legal_status}
      >
        <View style={styles.radioGroup}>
          <RadioButton value="sổ đỏ/sổ hồng" />
          <Text>Có sổ đỏ sổ hồng</Text>
          <RadioButton value="Chưa có" />
          <Text>Không có sổ đỏ sổ hồng</Text>
        </View>
      </RadioButton.Group>
      <Text style={styles.subtitle}>Trạng thái:</Text>
      <Text style={styles.textNotEdit}>{post.sale_status}</Text>

      <Text style={styles.subtitle}>Mô tả:</Text>
      <TextInput
        style={styles.textArea}
        value={post.description}
        multiline
        onChange={(e) => handleChange(e, "description")}
      />

      <Card.Actions>
        <Button mode="contained" onPress={handleSubmit}>
          Cập nhật
        </Button>
      </Card.Actions>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.tint,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingTop: 15,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  inputNotEdit: {
    flexDirection: "row",
  },
  groupInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textNotEdit: {
    marginVertical: 5,
  },
  subtitle: {
    width: 150,
    fontWeight: "bold",
    marginVertical: 5,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  picker: {
    height: 60,
  },
  label2: {
    fontSize: 16,
    marginLeft: 8,
    marginTop: 10,
  },
});

export default EditPost;
