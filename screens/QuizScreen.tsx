import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const quizData = {
  title: "General Knowledge Quiz",
  questions: [
    {
      id: 1,
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Earth", "Mars"],
      answer: 3,
      explanation:
        "Mars is known as the Red Planet due to its reddish appearance caused by iron oxide.",
    },
    {
      id: 2,
      text: "What is the chemical formula for water?",
      options: ["NaCl", "CO₂", "H₂O", "O₂"],
      answer: 2,
      explanation:
        "Water is composed of two hydrogen atoms and one oxygen atom: H₂O.",
    },
    // Add more questions as needed
  ],
};

export default function QuizScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData.questions[currentIndex];

  const handleOptionPress = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      navigation.navigate("ResultScreen", {
        score,
        total: quizData.questions.length,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{quizData.title}</Text>
      <Text style={styles.question}>{currentQuestion.text}</Text>

      {currentQuestion.options.map((option, index) => {
        const isSelected = selectedOption === index;
        const isCorrect = index === currentQuestion.answer;
        const optionStyle = isSelected
          ? isCorrect
            ? styles.correctOption
            : styles.wrongOption
          : styles.option;

        return (
          <TouchableOpacity
            key={index}
            style={optionStyle}
            disabled={selectedOption !== null}
            onPress={() => handleOptionPress(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      {showExplanation && (
        <Text style={styles.explanation}>💡 {currentQuestion.explanation}</Text>
      )}

      {selectedOption !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex < quizData.questions.length - 1
              ? "Next Question"
              : "View Results"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9f9f9", flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  question: { fontSize: 18, marginBottom: 15 },
  option: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  correctOption: {
    backgroundColor: "#c8e6c9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  wrongOption: {
    backgroundColor: "#ffcdd2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: { fontSize: 16 },
  explanation: {
    marginTop: 15,
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
  nextButton: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontWeight: "600" },
});
