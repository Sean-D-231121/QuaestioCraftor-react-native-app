import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { saveSubmittedAnswers, startQuizAttempt, completeQuizAttempt } from "../services/QuizAttemptAPI";
import { loadProfile } from "../services/ProfileService";
function QuizPlayerScreen({ route, navigation }: any) {
  const { quiz, quizId } = route.params;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (quiz && Array.isArray(quiz)) {
      const normalized = quiz.map((q: any, i: number) => {
        let parsedOptions = [];
        try {
          if (typeof q.options === "string" && q.options.trim() !== "") {
            parsedOptions = JSON.parse(q.options);
          } else if (Array.isArray(q.options)) {
            parsedOptions = q.options;
          }
        } catch (e) {
          console.warn("Failed to parse options for question:", q, e);
        }

        return {
          question_id: q.question_id,
          question: q.question || q.question_text,
          answer: q.answer,
          type: q.type,
          options: parsedOptions, 
        };
      });
      quiz.splice(0, quiz.length, ...normalized); // replace original
    }
  }, [quiz]);


  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);
  const [shortAnswer, setShortanswer] = useState("");
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const question = quiz[current];

  
  useEffect(() => {
        fetchProfile();
      }, []);
      
const fetchProfile = async () => {
  setLoading(true);
  const data = await loadProfile();
  if (data) {
    setProfile(data);
    const id = await startQuizAttempt(quizId, data.id);
    setAttemptId(id);
  }
  setLoading(false);
};

  

const handleAnswer = async (answer: string) => {
  const isCorrect =
    answer.trim().toLowerCase() === question.answer.trim().toLowerCase();

  setAnswers([
    ...answers,
    {
      question_id: question.question_id,
      selected_answer: answer,
      correct_answer: question.answer,
      is_correct: isCorrect,
    },
  ]);

  if (current + 1 < quiz.length) {
    setCurrent(current + 1);
    setShortanswer("");
  } else {
    setFinished(true);
  }
};

useEffect(() => {
  if (finished && attemptId && profile?.id) {
    const correctCount = answers.filter((a) => a.is_correct).length;
    const totalQuestions = answers.length;

    // Save answers
    saveSubmittedAnswers(attemptId, answers);

    // Update attempt with score and total
    completeQuizAttempt(attemptId, correctCount, totalQuestions, profile.id)
  }
}, [finished]);

if (finished) {
  const correctCount = answers.filter((a) => a.is_correct).length;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz Finished!</Text>
      <Text style={styles.subtitle}>
        You got {correctCount} / {answers.length} correct.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Question {current + 1}</Text>
      <Text style={styles.question}>{question.question}</Text>
      {question.type === "MCQ" &&
        Array.isArray(question.options) &&
        question.options.length > 0 &&
        question.options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            style={styles.button}
            onPress={() => handleAnswer(opt)}
          >
            <Text style={styles.buttonText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      {question.type === "True/False" && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAnswer("True")}
          >
            <Text style={styles.buttonText}>True</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAnswer("False")}
          >
            <Text style={styles.buttonText}>False</Text>
          </TouchableOpacity>
        </>
      )}
      {question.type === "Short answer" && (
        <>
          <TextInput
            placeholder="Enter your answer"
            placeholderTextColor="#8a7fa8"
            style={styles.input}
            value={shortAnswer}
            onChangeText={setShortanswer}
          ></TextInput>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAnswer(shortAnswer)}
          >
            <Text style={styles.buttonText}>Submit Answer</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
  
export default QuizPlayerScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1A1A60",
  },
  subtitle: { fontSize: 16, color: "#333", marginBottom: 20 },
  question: { fontSize: 18, marginBottom: 20, color: "#000" },
  button: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  wrongText: { color: "#B91C1C", fontSize: 14 },
  correctText: { color: "#047857", fontSize: 14 },
  wrongCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    width: "100%",
  },
  input: {
    backgroundColor: "#EDE7F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    width: "100%",
    height: 200,
    color: "#1A1A60",
  },
});