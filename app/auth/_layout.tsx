import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ headerTitle: "Đăng nhập" }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ headerTitle: "Đăng ký" }} 
      />
    </Stack>
  );
}
