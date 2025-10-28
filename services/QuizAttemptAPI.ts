
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

export async function completeQuizAttempt(attemptId: string, score: number, total: number) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .update({
      score,
      total,
      created_at: new Date().toISOString(),
    })
    .eq("attempt_id", attemptId)
    .select(); 

  if (error) {
    console.error("Supabase update error:", error);
    throw error;
  }

  console.log("Updated attempt:", data);
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




export async function fetchLeaderboard(filter: "Today" | "Weekly" | "All time") {
  let fromDate: string | null = null;

  const now = new Date();

  if (filter === "Today") {
    fromDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  } else if (filter === "Weekly") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(now.setDate(diff));
    fromDate = monday.toISOString().split("T")[0];
  }

  // Fetch quiz_attempts joined with users
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(`
      score,
      user_id,
      users!inner(id, username, avatar_url)
    `)
    .gte(fromDate ? "created_at" : "created_at", fromDate || "1970-01-01");

  if (error) throw error;

  // Aggregate points per user
  const pointsMap: Record<string, { username: string; avatar_url: string | null; points: number }> = {};
  data?.forEach((row: any) => {
    const username = row.users?.username ?? "Unknown";
    const avatar_url = row.users?.avatar_url ?? null;

    if (!pointsMap[row.user_id]) pointsMap[row.user_id] = { username, avatar_url, points: 0 };
    pointsMap[row.user_id].points += row.score ?? 0;
  });

  // Convert to array, sort by points descending
  return Object.values(pointsMap)
    .sort((a, b) => b.points - a.points)
    .map((u, idx) => ({ ...u, rank: idx + 1 }));
}


