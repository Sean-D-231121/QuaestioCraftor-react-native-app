
import { supabase } from "../supabase";
export interface SubmittedAnswer {
  question_id: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

export async function startQuizAttempt(quizId: string, userId: string | null) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert([
      {
        quiz_id: quizId,
        user_id: userId,
      },
    ])
    .select("attempt_id")
    .single();

  if (error) throw error;
  return data.attempt_id;
}

export async function completeQuizAttempt(attemptId: string, score: number) {
  const { error } = await supabase
    .from("quiz_attempts")
    .update({
      completed_at: new Date().toISOString(),
      score,
    })
    .eq("attempt_id", attemptId);

  if (error) throw error;
}

export async function saveSubmittedAnswers(
  attemptId: string,
  answers: SubmittedAnswer[]
) {
  const formattedAnswers = answers.map((a) => ({
    attempt_id: attemptId,
    question_id: a.question_id,
    selected_answer: a.selected_answer,
    correct_answer: a.correct_answer,
    is_correct: a.is_correct,
  }));

  const { error } = await supabase
    .from("submitted_answers")
    .insert(formattedAnswers);

  if (error) throw error;
}
