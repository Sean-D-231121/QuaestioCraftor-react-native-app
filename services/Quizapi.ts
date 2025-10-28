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
 export default interface Quiz {
  quizid: string;
  topic: string;
  quiz_type: string;
  difficulty: string;
  question_count: number;
  created_at: string;
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
    .select(); 

  if (error) throw error;
  console.log("🟢 Saved questions:", data);
  return data;
}


export async function fetchRecentQuizzes(limit = 10) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("quizid, topic, quiz_type, difficulty, question_count, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}



export async function fetchQuizQuestions(quizid : string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizid);

  if (error) throw error;
  return data;
}
export async function loadUserQuizHistory(userId: string) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(`
      attempt_id,
      score,
      total,
      created_at,
      quizzes (
        topic,
        quiz_type,
        difficulty,
        question_count
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quiz history:", error);
    return [];
  }

  // Format for display
  return data.map((attempt: any) => ({
    id: attempt.attempt_id,
    title: `${attempt.quizzes.topic} (${attempt.quizzes.quiz_type})`,
    questions: attempt.quizzes.question_count,
    score: `${attempt.score}/${attempt.total}`,
    created_at: attempt.created_at,
  }));
}
