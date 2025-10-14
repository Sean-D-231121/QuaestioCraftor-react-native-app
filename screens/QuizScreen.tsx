import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";


async function generateQuiz({ quizType, difficulty, questionCount, topic }: any) {

  return Array.from({ length: questionCount }).map((_, i) => ({
    type: quizType,
    question: `Sample question ${i + 1} about ${topic}?`,
    options:
      quizType === "MCQ"
        ? ["Option A", "Option B", "Option C", "Option D"]
        : undefined,
    answer: quizType === "MCQ" ? "Option A" : quizType === "True/False" ? "True" : "",
  }));
}

export default function CreateQuizScreen({ navigation }: any) {
  const [quizType, setQuizType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async () => {
    if (!quizType || !difficulty || !topic) {
      Alert.alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const quiz = await generateQuiz({ quizType, difficulty, questionCount, topic });
      navigation.navigate("QuizPlayerScreen", { quiz });
    } catch (e) {
      Alert.alert("Failed to generate quiz");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.username}>Hello Sean!</Text>
        </View>
      </View>

      {/* Quiz Type Buttons */}
      <View style={styles.buttonRow}>
        {["MCQ", "True/False", "Short answer"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, quizType === type && styles.activeButton]}
            onPress={() => setQuizType(type)}
          >
            <Text style={[styles.buttonText, quizType === type && styles.activeButtonText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Difficulty Buttons */}
      <View style={styles.buttonRow}>
        {["Easy", "Medium", "Hard"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.typeButton, difficulty === level && styles.activeButton]}
            onPress={() => setDifficulty(level)}
          >
            <Text style={[styles.buttonText, difficulty === level && styles.activeButtonText]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question Slider */}
      <Text style={styles.sectionTitle}>{questionCount} Questions</Text>
      <Slider
        style={{ width: "100%" }}
        minimumValue={5}
        maximumValue={50}
        step={1}
        minimumTrackTintColor="#6C63FF"
        maximumTrackTintColor="#ddd"
        thumbTintColor="#6C63FF"
        value={questionCount}
        onValueChange={setQuestionCount}
      />

      {/* File Upload Placeholder */}
      <View style={styles.uploadBox}>
        <Text style={styles.uploadText}>
          Drag and drop file(.jpeg, .png, .pdf)
        </Text>
      </View>

      {/* Input for topic */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="please enter what you want to test on."
          placeholderTextColor="#666"
          style={styles.input}
          value={topic}
          onChangeText={setTopic}
          multiline={true}
          numberOfLines={2}
          blurOnSubmit={false}
        />
        <TouchableOpacity style={styles.arrowButton} onPress={handleCreateQuiz} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    backgroundColor: "#EDE7F6",
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#6C63FF",
  },
  buttonText: {
    color: "#333",
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
    color: "#1A1A60",
  },
  uploadBox: {
    backgroundColor: "#1A1A60",
    borderRadius: 12,
    padding: 40,
    marginTop: 20,
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    backgroundColor: "#EDE7F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: "relative",
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 56,
    fontSize: 14,
    minHeight: 44,
    textAlignVertical: "top",
  },
  arrowButton: {
    backgroundColor: "#1A1A60",
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});