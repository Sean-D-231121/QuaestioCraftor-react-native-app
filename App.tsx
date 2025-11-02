// App.js
import React, { createContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "./supabase";
import { MD3LightTheme, MD3Theme, Provider as PaperProvider, } from "react-native-paper";
import { DefaultTheme as NavigationDefaultTheme, Theme as NavigationTheme } from "@react-navigation/native";
// Screens
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import CreateQuizScreen from "./screens/QuizScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ProfileScreen from "./screens/ProfileScreen";
import QuizPlayerScreen from "./screens/QuizPlayerScreen";
import SplashScreen from "./screens/splashscreen";

// Navigation Stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const customFonts = {
  displayLarge: {
    ...MD3LightTheme.fonts.displayLarge,
    fontFamily: "Roboto-Bold",
    fontWeight: "700" as const,
  },
  headlineSmall: {
    ...MD3LightTheme.fonts.headlineSmall,
    fontFamily: "Roboto-Medium",
    fontWeight: "500" as const,
  },
  bodyMedium: {
    ...MD3LightTheme.fonts.bodyMedium,
    fontFamily: "Roboto-Regular",
    fontWeight: "400" as const,
  },
};


type ExtendedMD3Theme = MD3Theme & {
  colors: MD3Theme["colors"] & {
    thirdColor: string;
  };
};

const theme: ExtendedMD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6C63FF",
    secondary: "#1A1A60",
    thirdColor: "#EDE7F6", // custom key
    background: "#F9F9FF",
  },
  fonts: {
    ...MD3LightTheme.fonts,
    ...customFonts,
  },
};


const navTheme: NavigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.secondary,
    border: "#E0E0E0",
    notification: theme.colors.primary,
  },
};
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ color, size }: any) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "CreateQuiz") iconName = "add-circle" ;
          else if (route.name === "Leaderboard") iconName = "trophy";
          else if (route.name === "Profile") iconName = "person";
          else iconName = "ellipse"; // fallback

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#1A1A60",
        tabBarInactiveTintColor: "#EDE7F6",
        tabBarStyle: {
          backgroundColor: "#6C63FF",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CreateQuiz" component={CreateQuizScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const minSplashTime = new Promise((resolve) => setTimeout(resolve, 5000));

  useEffect(() => {
  let mounted = true;

  const init = async () => {
    try {
      const sessionPromise = supabase.auth.getSession();
        const [{ data: { session } }] = await Promise.all([sessionPromise, minSplashTime]);
      if (!mounted) return;
      setIsAuthenticated(!!session);
    } catch (err) {
      console.error('getSession error', err);
      if (!mounted) return;
      setIsAuthenticated(false);
    }finally {
        if (mounted) setShowSplash(false);
      }
  };

  init();

  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {

    if (!mounted) return;
    setIsAuthenticated(!!session);
  });

  return () => {
    mounted = false;
    listener.subscription.unsubscribe();
  };
}, []);

  // Show nothing while checking auth
   if (showSplash || isAuthenticated === null) return <SplashScreen />;

  return (
    <PaperProvider theme={theme}>
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="HomeScreen" component={DashboardTabs} />
            <Stack.Screen name="QuizPlayerScreen" component={QuizPlayerScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}
