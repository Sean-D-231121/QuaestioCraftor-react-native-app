import React, { use, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator, 
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Quiz, { fetchRecentQuizzes, fetchQuizQuestions } from "../services/Quizapi";
import { loadProfile } from "../services/ProfileService";
import { Avatar, Button, Card, useTheme, Text } from "react-native-paper";



function HomeScreen({ navigation }: any) {
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const theme = useTheme();
  useEffect(() => {
  // Load immediately
  loadRecentQuizzes();
  fetchProfile();

  // Refresh every 10 seconds
  const interval = setInterval(() => {
    loadRecentQuizzes();
    fetchProfile();
  }, 10000);

  // Cleanup interval on unmount
  return () => clearInterval(interval);
}, []);

const fetchProfile = async () => {
  try {
    setLoading(true);
    const data = await loadProfile();
    if (data) setProfile(data);
  } catch (error) {
    console.error("Error loading profile:", error);
  } finally {
    setLoading(false);
  }
};

const loadRecentQuizzes = async () => {
  try {
    setLoading(true);
    const data = await fetchRecentQuizzes();
    if (data) setRecentQuizzes(data);
  } catch (error) {
    console.error("Error fetching recent quizzes:", error);
  } finally {
    setLoading(false);
  }
  };

  const handlePlayQuiz = async (quiz : any) => {
    try {
      const questions = await fetchQuizQuestions(quiz.quizid);
      if (!questions || questions.length === 0) {
        alert("This quiz has no questions yet.");
        return;
      }
      navigation.navigate("QuizPlayerScreen", {
        quiz: questions,
        quizId: quiz.quizid,
      });
    } catch (err) {
      console.error("Error fetching quiz questions:", err);
      alert("Failed to load quiz questions.");
    }
  };

  return (
     <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        {profile?.avatar_url ? (
          <Avatar.Image size={48} source={{ uri: profile.avatar_url }} />
        ) : (
          <Avatar.Icon size={48} icon="account" />
        )}
        <View style={{ marginLeft: 10 }}>
          <Text variant="titleSmall">Welcome</Text>
          <Text variant="titleMedium">Hello {profile?.username}!</Text>
        </View>
      </View>

      {/* ACTION CARDS */}
      <View style={styles.actions}>
        <Card style={styles.actionCard} onPress={() => navigation.navigate("CreateQuiz")}>
          <Card.Content style={styles.cardContent}>
            <Ionicons name="add-circle-outline" size={32} color="#fff" />
            <Text style={styles.cardText}>Generate Quiz</Text>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard} onPress={() => navigation.navigate("Leaderboard")}>
          <Card.Content style={styles.cardContent}>
            <Ionicons name="trophy-outline" size={32} color="#fff" />
            <Text style={styles.cardText}>Leaderboards</Text>
          </Card.Content>
        </Card>
      </View>

      {loading ? (
        <View style={styles.quizList}>
          {recentQuizzes.map((quiz) => (
            <Card key={quiz.quizid} style={styles.quizCard}>
              <Card.Title
                title={quiz.topic}
                subtitle={`${quiz.quiz_type} • ${quiz.difficulty} • ${quiz.question_count} Questions`}
              />
              <Card.Actions>
                <Button
                  icon="play-circle"
                  mode="contained"
                  onPress={() => handlePlayQuiz(quiz)}
                   buttonColor="#6C63FF"
                >
                  Play Quiz
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      ) : (
        <View style={styles.quizList}>
          {recentQuizzes.map((quiz) => (
            <Card key={quiz.quizid} style={styles.quizCard}>
              <Card.Title
                title={quiz.topic}
                subtitle={`${quiz.quiz_type} • ${quiz.difficulty} • ${quiz.question_count} Questions`}
              />
              <Card.Actions>
                <Button
                  icon="play-circle"
                  mode="contained"
                  onPress={() => handlePlayQuiz(quiz)}
                   buttonColor="#6C63FF"
                >
                  Play Quiz
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    width: "48%",
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  cardText: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 8,
  },
  quizList: {
    marginTop: 10,
  },
  quizCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  
});
