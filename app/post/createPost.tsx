import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import axios from "axios";
import { TextInput, Card, Button, RadioButton } from "react-native-paper";
import { PostDataType, PostFormData } from "../../types/index";
import { useAppContext } from "@/AppProvider";
import API_BASE_URL from "../../config";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
type Props = {};

const CreatePost = (props: Props) => {
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
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    estate_type: "nhà",
    price: "",
    city: "Đà Nẵng",
    district: "",
    ward: "",
    street: "",
    address: "",
    orientation: "",
    land_lot: "",
    map_sheet_number: "",
    land_parcel: "",
    area: 0,
    width: 0,
    length: 0,
    frontage: 0,
    bedroom: 0,
    bathroom: 0,
    floor: 0,
    legal_status: "Chưa có",
    sale_status: "đang bán",
    longitude: "",
    latitude: "",
    images: null,
    description: "",
  });
  const [posts2, setPosts2] = useState<PostDataType[]>([]);
  console.log(selectedDistrict);
  const handleInputChange = (
    field: keyof PostDataType,
    value: string | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleInputChangeWithFilter = (
    field: keyof PostDataType,
    value: string | number | null
  ) => {
    if (typeof value === "string") {
      const isNumeric = /^\d+$/.test(value); // Kiểm tra chuỗi chỉ chứa số

      if (isNumeric) {
        const filteredValue = value.replace(/[.,:;!?]/g, ""); // Loại bỏ ký tự đặc biệt
        setFormData((prev) => ({
          ...prev,
          [field]: filteredValue,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
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
  const [price, setPrice] = useState(""); 
  const [unit, setUnit] = useState(""); 
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
  // const handlePriceChange = (value: string) => {
  //   const formattedValue = value.replace(/\D/g, "");
  //   handleInputChange("price", formattedValue ? `${formattedValue}` : "");
  // };

  const handleUnitChange = (unit: string) => {
    setUnit(unit); // Cập nhật đơn vị người dùng chọn // Cập nhật giá trị sau khi thay đổi đơn vị
  };
  const handlePriceChange = (value: string) => {
    const formattedValue = value.replace(/\D/g, ""); 
    if (formattedValue.length <= 12) {
      setPrice(formattedValue); 
      updatePrice(formattedValue, unit); 
    }
  };
  const updatePrice = (price: string, unit: string) => {
    const priceNumber = parseInt(price, 10);
    if (isNaN(priceNumber) || priceNumber === 0) {
      setFormData({ ...formData, price: "" });
      return;
    }

    let value = priceNumber;
    if (unit === "trieu") {
      value = value * 1000000; 
    } else if (unit === "ty") {
      value = value * 1000000000; 
    }
    setFormData({
      ...formData,
      price: value.toString(),
    });
  };
  const handleAreaChange = (value: string) => {
    const formattedValue = value.replace(/\D/g, "");
    handleInputChange("area", formattedValue ? `${formattedValue} ` : "");
  };
  const validateForm = () => {
    const requiredFields = [
      "title",
      "price",
      "district",
      "ward",
      "address",
      "area",
      "width",
      "length",
      "bedroom",
      "bathroom",
      "floor",
      "legal_status",
      "sale_status",
      "longitude",
      "latitude",
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field] === "") {
        return `Vui lòng điền đầy đủ thông tin cho trường ${field}.`;
      }
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      return "Giá phải là một số hợp lệ và lớn hơn 0.";
    }

    if (formData.area <= 0 || formData.width <= 0 || formData.length <= 0) {
      return "Diện tích, chiều rộng và chiều dài phải lớn hơn 0.";
    }

    return "";
  };
  const formatCurrencyToMillion = (amount: number) => {
    const million = amount / 1e9;
    return `${million.toFixed(3)} tỷ VND`;
  };
  const handlePostSubmit = async () => {
    if (
      !formData.title ||
      !formData.estate_type ||
      !formData.price ||
      !formData.city ||
      !formData.district ||
      !formData.ward ||
      !formData.address ||
      !formData.orientation ||
      !formData.area ||
      !formData.length ||
      !formData.width ||
      !formData.frontage ||
      (formData.estate_type === "nhà" &&
        (!formData.bedroom || !formData.bathroom || !formData.floor)) ||
      !formData.legal_status
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      console.log(formData);
      const validationError = validateForm();
      // if (validationError) {
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      setPosts2(response.data);
      console.log(response.data);
      router.push(`/post/addImagePost?id=${response.data.data.post_id}`);
      // }
    } catch (error) {}
  };
  const [selectedValue, setSelectedValue] = useState("");

  const wards =
    data.find((item) => item.district === selectedDistrict)?.wards || [];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.titleCard}>Tạo Bài Đăng</Text>
        <Card.Content>
          <TextInput
            label="Tiêu Đề"
            value={formData.title}
            onChangeText={(text) => handleInputChange("title", text)}
            style={styles.input}
          />
          <Text style={styles.label}>Loại Bất Động Sản</Text>
          <RadioButton.Group
            onValueChange={(value) => {
              setSelectedValue(value);
              handleInputChange("estate_type", value);
            }}
            value={selectedValue}
          >
            <View style={styles.radioGroup}>
              <View style={styles.radioOption}>
                <RadioButton value="nhà" />
                <Text>Nhà</Text>
              </View>

              <View style={styles.radioOption}>
                <RadioButton value="đất" />
                <Text>Đất</Text>
              </View>
            </View>
          </RadioButton.Group>
          {selectedValue == "nhà" && (
            <View style={styles.input}>
              <TextInput
                label="Số tầng"
                style={styles.input}
                value={formData.floor.toString()}
                onChangeText={(text) =>
                  handleInputChange("floor", parseInt(text))
                }
                placeholder="Nhập số tầng"
                keyboardType="numeric"
              />
              <TextInput
                label="Số phòng ngủ"
                style={styles.input}
                value={formData.bedroom.toString()}
                onChangeText={(text) =>
                  handleInputChange("bedroom", parseInt(text))
                }
                placeholder="Nhập số phòng ngủ"
                keyboardType="numeric"
              />
              <TextInput
                label="Số phòng tắm"
                style={styles.input}
                value={formData.bathroom.toString()}
                onChangeText={(text) =>
                  handleInputChangeWithFilter("bathroom", parseInt(text))
                }
                placeholder="Nhập số phòng tắm"
                keyboardType="numeric"
              />
            </View>
          )}
          <View style={styles.groupInput}>
            <TextInput
              label="Diện Tích (m²)"
              value={formData.area.toString()}
              onChangeText={(text) =>
                handleInputChange("area", parseInt(text) | 0)
              }
              style={styles.inputGroup}
              keyboardType="numeric"
            />

            <TextInput
              label="Mặt Tiền (m)"
              value={formData.frontage.toString()}
              onChangeText={(text) =>
                handleInputChange("frontage", parseInt(text) | 0)
              }
              style={styles.inputGroup}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.groupInput}>
            <TextInput
              label="Chiều dài (m)"
              value={formData.length.toString()}
              onChangeText={(text) =>
                handleInputChange("length", parseInt(text) | 0)
              }
              style={styles.inputGroup}
              keyboardType="numeric"
            />
            <TextInput
              label="Chiều rộng (m)"
              value={formData.width.toString()}
              onChangeText={(text) =>
                handleInputChange("width", parseInt(text) | 0)
              }
              style={styles.inputGroup}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.label2}>Quận :</Text>
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={(value) => {
              setSelectedDistrict(value);
              handleInputChange("district", value);
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

          <Text style={styles.label2}>Phường :</Text>
          {selectedDistrict && (
            <Picker
              selectedValue={selectedWard}
              onValueChange={(value) => {
                setSelectedWard(value);
                handleInputChange("ward", value);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Chọn phường" value="" />
              {wards.map((ward, index) => (
                <Picker.Item key={index} label={ward} value={ward} />
              ))}
            </Picker>
          )}
          <TextInput
            label="Đường/số nhà"
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
            style={styles.input}
          />
          <Text style={styles.label2}>Hướng :</Text>
          <Picker
            selectedValue={formData.orientation}
            onValueChange={(itemValue) =>
              handleInputChange("orientation", itemValue)
            }
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
          <Text style={styles.label}>Tình trạng pháp lý</Text>
          <RadioButton.Group
            onValueChange={(value) => handleInputChange("legal_status", value)}
            value={formData.legal_status}
          >
            <View style={styles.radioGroup}>
              <RadioButton value="sổ đỏ/sổ hồng" />
              <Text>Có sổ đỏ sổ hồng</Text>
              <RadioButton value="Chưa có" />
              <Text>Không có sổ đỏ sổ hồng</Text>
            </View>
          </RadioButton.Group>
          <TextInput
            label="Lô Đất"
            value={formData.land_lot}
            onChangeText={(text) => handleInputChange("land_lot", text)}
            placeholder="Ví dụ : Lô A1-30"
            style={styles.input}
          />

          <TextInput
            label="Thửa Đất"
            value={formData.land_parcel}
            onChangeText={(text) => handleInputChange("land_parcel", text)}
            placeholder="Ví dụ : 5"
            style={styles.input}
          />
          {/* <TextInput
            label="Giá (VND)"
            value={formData.price}
            onChangeText={handlePriceChange}
            style={styles.input}
            keyboardType="numeric"
          /> */}
          <TextInput
            label="Giá (VND)"
            value={price}
            onChangeText={handlePriceChange}
            style={{ borderWidth: 1, padding: 10 }}
            keyboardType="numeric"
            maxLength={12}
          />
          <View style={styles.groupInput}>
            <Picker
              selectedValue={unit}
              onValueChange={handleUnitChange}
              style={{ height: 60, width: 100 }}
            >
              <Picker.Item label="Chọn đơn vị" value="" />
              <Picker.Item label="Triệu" value="trieu" />
              <Picker.Item label="Tỷ" value="ty" />
            </Picker>
            <Text>
              Giá :{" "}
              {formData.price ? `${formatCurrencyToMillion(Number(formData.price))}` : "Chưa có giá trị"}
            </Text>
          </View>
          <TextInput
            label="Mô Tả"
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            style={styles.textArea}
            multiline
          />
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handlePostSubmit}>
            Tiếp theo
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  card: {
    paddingTop: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  titleCard: {
    fontSize: 18,
    fontWeight: "500",
    padding: 16,
    textAlign: "center",
    color: Colors.tint,
  },
  groupInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputGroup: {
    width: 160,
    backgroundColor: "white",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
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
  label: {
    marginBottom: 8,
    fontSize: 16,
    marginLeft: 8,
  },
  label2: {
    fontSize: 16,
    marginLeft: 8,
    marginTop: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  picker: {
    height: 60,
  },
});
