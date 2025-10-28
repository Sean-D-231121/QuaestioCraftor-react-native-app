import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { saveQuiz, saveQuestions } from "../services/Quizapi";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { loadProfile } from "../services/ProfileService";


async function generateQuiz({ quizType, difficulty, questionCount, topic } : any) {
  const prompt = `Generate ${questionCount} ${difficulty} level can only be ${quizType} quiz questions about ${topic} in JSON format.
The JSON should be an array of objects where each object has:
- "question": the question text,
- "options": an array of answer options (if quizType is "MCQ"; otherwise omit or leave empty),
- "answer": the correct answer.
- "type": the type of question ("MCQ", "True/False", "Short answer").
Ensure it is a valid JSON.`;
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 300000);
  const response = await fetch(
    "https://quaestiocraftor-backend.onrender.com/generate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, max_tokens: 2000 }),
      signal: controller.signal,
    }
  );
  timeout

  if (!response.ok) {
    const errorData = await response.json();
   
    throw new Error(errorData.detail);
  }

 
  
  const quiz = await response.json();
  //  console.log("Generated Quiz:", quiz);
  return quiz;
}

function CreateQuizScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [quizType, setQuizType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      fetchProfile();
    }, []);
    
      const fetchProfile = async () => {
      setLoading(true);
      const data = await loadProfile();
      if (data) setProfile(data);
      setLoading(false);
    };

   const handleCreateQuiz = async () => {
     if (!quizType || !difficulty || !topic) {
       Alert.alert("Please fill all fields");
       return;
     }

     setLoading(true);

     try {
       const userId = profile?.id || null;

      
       const generatedQuiz = await generateQuiz({
         quizType,
         difficulty,
         questionCount,
         topic,
       });

       
       const quizId = await saveQuiz({
         userId,
         topic,
         quizType,
         difficulty,
         questionCount,
       });
      //  gets questions ready for the quiz player screen
       const savedQuestions = await saveQuestions(quizId, generatedQuiz);
       navigation.navigate("QuizPlayerScreen", {
         quiz: savedQuestions,
         quizId,
       });

     } catch (error: any) {
       console.error(" Quiz generation error:", error);
       Alert.alert("Error", error.message || "Unknown error");
     } finally {
       setLoading(false);
     }
   };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile?.avatar_url }} style={styles.avatar} />
        <View>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.username}>Hello {profile?.username}!</Text>
        </View>
      </View>

      {/* Quiz Type Buttons */}
      <View style={styles.buttonRow}>
        {["MCQ", "True/False", "Mixed"].map((type) => (
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
        maximumValue={15}
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
export default CreateQuizScreen;

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