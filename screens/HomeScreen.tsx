import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
import { supabase } from "../supabase";



function HomeScreen({ navigation }: any) {
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);


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
    <View style={styles.container}>
      <View style={styles.header}>
              <Image source={{ uri: profile?.avatar_url }} style={styles.avatar} />
              <View>
                <Text style={styles.welcome}>Welcome</Text>
                <Text style={styles.username}>Hello {profile?.username}!</Text>
              </View>
            </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CreateQuiz")}
        >
          <Ionicons name="add-circle-outline" size={32} color="#fff" />
          <Text style={styles.cardText}>Generate Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Leaderboard")}
        >
          <Ionicons name="trophy-outline" size={32} color="#fff" />
          <Text style={styles.cardText}>Leaderboards</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : (
        <ScrollView
        
        contentContainerStyle={styles.quizScroll}
      >
        {recentQuizzes.map((quiz) =>
        <View key={quiz.quizid} style={styles.quizCard}>
          <Text style={styles.quizTitle}>{quiz.topic}</Text>
          <Text style={styles.quizMeta}>
                {quiz.quiz_type} • {quiz.difficulty} • {quiz.question_count} Questions
          </Text>
          <TouchableOpacity
          style={styles.playButton}
          onPress={() => handlePlayQuiz(quiz)}>
            <Ionicons name="play-circle" size={28} color="#6C63FF" />
            <Text style={styles.playText}>Play Quiz</Text>
        </TouchableOpacity>
        </View>
        )}
        
        </ScrollView>
      )}
    </View>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
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
  card: {
    backgroundColor: "#6C63FF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
  },
  cardText: { color: "#fff", marginTop: 8, fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    borderRadius: 12,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  navText: { color: "#fff", fontSize: 12, textAlign: "center" },
   quizScroll: { paddingVertical: 10 ,justifyContent: "center",alignItems: "center" },
  quizCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: "95%",
    elevation: 3,
    height: 140,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quizTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6, color: "#1A1A60", margin: "auto" },
  quizMeta: { fontSize: 14, color: "#666", marginBottom: 10 },
  playButton: {
    flexDirection: "row",
    backgroundColor: "#6C63FF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    width: "100%",
  },
  playText: { color: "#fff", fontWeight: "600", marginLeft: 6, textAlign: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
    welcome: {
    fontSize: 14,
    color: "#333",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
