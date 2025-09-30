// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import CreateQuizScreen from "./screens/QuizScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ProfileScreen from "./screens/ProfileScreen";

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
          else iconName = "ellipse"; // fallback icon

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
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Main app */}
        <Stack.Screen name="Dashboard" component={DashboardTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
