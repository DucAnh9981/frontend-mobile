import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import AppProvider from "@/AppProvider";
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="post/[id]" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="user/[id]" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="messages/[id]" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="post/commonPage" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="post/createPost" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="post/createPostSuccess" options={{  headerShown: false  }} />

        <Stack.Screen name="post/addImagePost" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="post/EditPost" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="user/dudoan" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="user/message" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="other/termsOfUse" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="other/aboutUs" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="other/guide" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="other/helpCenter" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="other/authNoToken" options={{ headerTitle: "Trở lại" }} />

        <Stack.Screen name="user/dudoannha" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="user/notification" options={{ headerTitle: "Trở lại" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </AppProvider>
  );
}
