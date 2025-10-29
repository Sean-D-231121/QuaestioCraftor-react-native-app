
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

export async function completeQuizAttempt(attemptId: string, score: number, total: number, userId: string | null) {
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
    if (userId) {
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("points")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    const newPoints = (userData?.points || 0) + score;

    const { error: updateError } = await supabase
      .from("users")
      .update({ points: newPoints })
      .eq("id", userId);

    if (updateError) throw updateError;
  
  }
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
  const now = new Date();
  let fromDate: Date;

  if (filter === "Today") {
    fromDate = new Date(now);
    fromDate.setHours(0, 0, 0, 0); // start of today
  } else if (filter === "Weekly") {
    const day = now.getDay(); // Sunday = 0
    fromDate = new Date(now);
    fromDate.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); // start of Monday
    fromDate.setHours(0, 0, 0, 0);
  } else {
    fromDate = new Date("1970-01-01");
  }

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(`
      score,
      user_id,
      users!inner(id, username, avatar_url)
    `)
    .gte("created_at", fromDate.toISOString());

  if (error) {
    console.error("Error fetching leaderboard:", error.message);
    return [];
  }

  
  const pointsMap: Record<
    string,
    { username: string; avatar_url: string | null; points: number }
  > = {};
  data?.forEach((row: any) => {
    const username = row.users?.username ?? "Unknown";
    const avatar_url = row.users?.avatar_url ?? null;

    if (!pointsMap[row.user_id])
      pointsMap[row.user_id] = { username, avatar_url, points: 0 };
    pointsMap[row.user_id].points += row.score ?? 0;
  });

  // Convert to array and sort by points descending
  const leaderboard = Object.entries(pointsMap)
    .map(([user_id, value]) => ({
      id: user_id,
      username: value.username,
      avatar_url: value.avatar_url,
      points: value.points,
    }))
    .sort((a, b) => b.points - a.points); // sort first

  // Assign rank after sorting
  return leaderboard.map((user, idx) => ({
    ...user,
    rank: idx + 1,
  }));
}


