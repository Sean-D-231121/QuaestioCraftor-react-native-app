import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
function QuizPlayerScreen({ route, navigation }: any) {
  const { quiz } = route.params;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);
  const [shortAnswer, setShortanswer] = useState("");

  const question = quiz[current];

   const handleAnswer = (answer: string) => {
    //  Store both user answer and correct answer
    setAnswers([
      ...answers,
      { 
        question: question.question, 
        selected: answer, 
        correct: question.answer 
      },
    ]);

    if (current + 1 < quiz.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    // Separate correct and wrong answers
    const wrongAnswers = answers.filter(a => a.selected !== a.correct);
    const correctCount = answers.length - wrongAnswers.length;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quiz Finished!</Text>
        <Text style={styles.subtitle}>
          You got {correctCount} / {answers.length} correct.
        </Text>

        {wrongAnswers.length > 0 ? (
          <>
            <Text style={[styles.title, { marginTop: 20 }]}>Questions You Got Wrong:</Text>
            {wrongAnswers.map((item, index) => (
              <View key={index} style={styles.wrongCard}>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.wrongText}>Your Answer: {item.selected}</Text>
                <Text style={styles.correctText}>Correct Answer: {item.correct}</Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={{ color: "green", marginVertical: 20 }}>Perfect Score! 🎉</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
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
        question.options &&
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
            placeholder="you@example.com"
            placeholderTextColor="#8a7fa8"
            style={styles.input}
            value={shortAnswer}
            onChangeText={setShortanswer}
            keyboardType="email-address"
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