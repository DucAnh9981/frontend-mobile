import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import LottieView from "lottie-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size || 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Khám phá",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="paper-plane" size={size || 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "AI dự đoán",
          tabBarIcon: ({ color, size }) => (
            <View>
              <LottieView
                source={require("@/assets/images/AI-icon.json")}
                autoPlay
                loop
                style={styles.notifiIcon}
              />
              <Text style={styles.text}>AI</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Bài đăng",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="article" size={size || 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Cài Đặt",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size || 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  notifiIcon: {
    position: "relative",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
  },
  text: {
    position: "relative",
    bottom: 33,
    left: 18,
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
});
