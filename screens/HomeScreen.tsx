import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const recentQuizzes = [
  {
    id: "1",
    title: "Understanding Mitochondria",
    questions: 15,
    score: "13/15",
  },
  { id: "2", title: "Cell Structure Basics", questions: 12, score: "12/15" },
];

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome\nHello Sean!</Text>

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

      <Text style={styles.sectionTitle}>Recent Quizzes</Text>
      <FlatList
        data={recentQuizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.quizItem}>
            <Text style={styles.quizTitle}>{item.title}</Text>
            <Text style={styles.quizMeta}>
              Questions: {item.questions} | Score: {item.score}
            </Text>
          </View>
        )}
      />

      
    </View>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
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
  quizItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  quizTitle: { fontSize: 16, fontWeight: "600" },
  quizMeta: { fontSize: 14, color: "#555" },
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
});
