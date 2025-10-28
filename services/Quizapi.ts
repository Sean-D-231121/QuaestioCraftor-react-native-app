 import { supabase } from "../supabase";

 interface QuizData {
   userId: string | null;
   topic: string;
   quizType: string;
   difficulty: string;
   questionCount: number;
 }

 interface Question {
   question: string;
   options?: string[] | null;
   answer: string;
   type: string;
 }

export async function saveQuiz({userId, topic, quizType, difficulty,questionCount,}: QuizData): Promise<string> {
  const { data, error } = await supabase
    .from("quizzes")
    .insert([
      {
        user_id: userId,
        topic,
        quiz_type: quizType,
        difficulty,
        question_count: questionCount,
      },
    ])
    .select("quizid")
    .single();

  if (error) throw error;
  return data.quizid;
}


export async function saveQuestions(quizId: string, questions: any[]) {
  const formatted = questions.map((q) => ({
    quiz_id: quizId,
    question_text: q.question || q.question_text,
    answer: q.answer,
    type: q.type,
    options: q.options ? JSON.stringify(q.options) : null,
  }));

  const { data, error } = await supabase
    .from("questions")
    .insert(formatted)
    .select(); // ✅ ensures Supabase returns the new rows

  if (error) throw error;
  console.log("🟢 Saved questions:", data);
  return data;
}
