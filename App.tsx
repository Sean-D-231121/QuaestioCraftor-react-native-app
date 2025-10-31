// App.js
import React, { createContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "./supabase";
// Screens
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import CreateQuizScreen from "./screens/QuizScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ProfileScreen from "./screens/ProfileScreen";
import QuizPlayerScreen from "./screens/QuizPlayerScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ color, size }: any) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "CreateQuiz") iconName = "add-circle";
          else if (route.name === "Leaderboard") iconName = "trophy";
          else if (route.name === "Profile") iconName = "person";
          else iconName = "ellipse"; // fallback

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "gray",
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
  

  useEffect(() => {
  let mounted = true;

  const init = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('auth init session', session);
      if (!mounted) return;
      setIsAuthenticated(!!session);
    } catch (err) {
      console.error('getSession error', err);
      if (!mounted) return;
      setIsAuthenticated(false);
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
  if (isAuthenticated === null) return null;

  return (
    <NavigationContainer>
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
  );
}
