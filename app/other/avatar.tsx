import React from "react";
import { View, Text, StyleSheet } from "react-native";

const randomColors = [
    "#2A9D8F", "#264653", "#457B9D", "#1D3557", "#3A506B",
    "#4A4E69", "#1B4965", "#2D6A4F", "#81B29A", "#7F7F7F",
    "#8ECAE6", "#4C566A", "#6D6875"
  ];

const getColorFromName = (name) => {
  if (!name) return randomColors[0]; 
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return randomColors[hash % randomColors.length];
};

const getInitial = (name) => {
  if (!name) return "";
  const words = name.match(/[a-zA-Z0-9]+/g) || [];
  return words.map((word) => word.charAt(0).toUpperCase()).join("").slice(0, 2);
};

const Avatar = ({ name }) => {
  const backgroundColor = React.useMemo(() => getColorFromName(name), [name]);
  const initial = getInitial(name);

  return (
    <View style={[styles.avatar, { backgroundColor }]}>
      <Text style={styles.text}>{initial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight:5,
  },
  text: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Avatar;
