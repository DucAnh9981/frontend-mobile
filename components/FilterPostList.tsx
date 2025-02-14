import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    priceRange: number[];
    saleStatus: string;
    legalStatus: string;
    district: string;
  }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApplyFilters,
}) => {
  const [priceRange, setPriceRange] = useState([1000000000, 10000000000]);
  const [saleStatus, setSaleStatus] = useState("");
  const [legalStatus, setLegalStatus] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());
  const [currentPrice, setCurrentPrice] = useState(priceRange[1]);
  const districts = [
    "Liên Chiểu",
    "Hải Châu",
    "Sơn Trà",
    "Thanh Khê",
    "Ngũ Hành Sơn",
    "Cẩm Lệ",
  ];

  const formatCurrencyToMillion = (amount: number) => {
    const million = amount / 1e9;
    return `${million.toFixed(1)} tỷ VND`;
  };

  const resetFilters = () => {
    setPriceRange([1000000000, 1000000000]);
    setSaleStatus("");
    setLegalStatus("");
    setDistrict("");
    setMinPrice("1000000000");
    setMaxPrice("10000000000");
    setCurrentPrice(100000000000);
  };

  const handleApply = () => {
    const filters = {
      priceRange,
      saleStatus,
      legalStatus,
      district: district || "Tất cả",
    };
    onApplyFilters(filters);
    resetFilters();
    onClose();
  };

  const handleSliderChange = (value: number) => {
    setCurrentPrice(value);
    setPriceRange([Number(minPrice), value]);
  };

  const handleMinPriceChange = (text: string) => {
    const parsedValue = parseInt(text, 10);
    if (!isNaN(parsedValue) && parsedValue <= Number(maxPrice)) {
      setMinPrice(text);
      setPriceRange([parsedValue, Number(maxPrice)]);
    }
  };

  const handleMaxPriceChange = (text: string) => {
    const parsedValue = parseInt(text, 10);
    if (!isNaN(parsedValue) && parsedValue >= Number(minPrice)) {
      setMaxPrice(text);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={() => onClose()}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Bộ Lọc</Text>
        <Text style={styles.filterLabel}>Giá tiền</Text>

        <View style={styles.priceInputs}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={minPrice}
            onChangeText={handleMinPriceChange}
            maxLength={12}
          />
          <Text style={styles.separator}> - </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={handleMaxPriceChange}
            maxLength={12}
          />
        </View>
        <View style={styles.filterLabels}>
          <Text style={styles.filterLabel}>Min</Text>
          <Text style={styles.filterLabel}>Max</Text>
        </View>
        <Slider
          style={{ width: "100%" }}
          minimumValue={Number(minPrice)}
          maximumValue={Number(maxPrice)} // Giới hạn tối đa của slider
          value={10000000000}
          step={10000000} // Bước nhảy của slider
          minimumTrackTintColor="#3CA9F9"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#007bff"
          onValueChange={handleSliderChange}
        />
        <Text style={styles.currentPrice}>
          {formatCurrencyToMillion(Number(minPrice))} đến{" "}
          {formatCurrencyToMillion(currentPrice)}
        </Text>
        <Text style={styles.filterLabel}>Tình trạng</Text>
        <Picker
          selectedValue={saleStatus}
          onValueChange={(itemValue) => setSaleStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tất cả" value="" />
          <Picker.Item label="Đang bán" value="Đang bán" />
          <Picker.Item label="Đang thương lượng" value="Đang thương lượng" />
          <Picker.Item label="Đã cọc" value="Đã cọc" />
        </Picker>
        <Text style={styles.filterLabel}>Tình trạng pháp lý</Text>
        <Picker
          selectedValue={legalStatus}
          onValueChange={(itemValue) => setLegalStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tất cả" value="" />
          <Picker.Item label="sổ đỏ/sổ hồng" value="sổ đỏ/sổ hồng" />
          <Picker.Item label="Chưa có" value="" />
        </Picker>
        <Text style={styles.filterLabel}>Địa điểm</Text>
        <Picker
          selectedValue={district}
          onValueChange={(itemValue) => setDistrict(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tất cả" value="" />
          {districts.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              resetFilters();
              onClose();
            }}
          >
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={handleApply}
          >
            <Text style={styles.buttonText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    // marginBottom: 10,
  },
  filterLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  picker: {
    height: 60,
    width: "100%",
    borderRadius: 3,
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  applyButton: {
    backgroundColor: Colors.tint,
  },
  buttonText: {
    color: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    textAlign: "center",
    marginHorizontal: 5,
  },
  priceInputs: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  separator: {
    fontSize: 18,
    fontWeight: "bold",
  },
  currentPrice: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.tint,
    marginVertical: 10,
  },
});
