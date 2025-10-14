import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function QuizPlayerScreen({ route, navigation }: any) {
  const { quiz } = route.params;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);

  const question = quiz[current];

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, { question: question.question, answer }]);
    if (current + 1 < quiz.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Finished!</Text>
        <Text style={styles.subtitle}>You answered {answers.length} questions.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Question {current + 1}</Text>
      <Text style={styles.question}>{question.question}</Text>
      {question.type === "MCQ" && question.options && (
        question.options.map((opt: string) => (
          <TouchableOpacity key={opt} style={styles.button} onPress={() => handleAnswer(opt)}>
            <Text style={styles.buttonText}>{opt}</Text>
          </TouchableOpacity>
        ))
      )}
      {question.type === "True/False" && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => handleAnswer("True")}>
            <Text style={styles.buttonText}>True</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleAnswer("False")}>
            <Text style={styles.buttonText}>False</Text>
          </TouchableOpacity>
        </>
      )}
      {question.type === "Short answer" && (
        <TouchableOpacity style={styles.button} onPress={() => handleAnswer("Answered")}>
          <Text style={styles.buttonText}>Submit Answer</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10, color: "#1A1A60" },
  subtitle: { fontSize: 16, color: "#333", marginBottom: 20 },
  question: { fontSize: 18, marginBottom: 20, color: "#000" },
  button: { backgroundColor: "#6C63FF", padding: 16, borderRadius: 12, marginVertical: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});