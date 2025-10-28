import { supabase } from "../supabase";

export const loadProfile = async () => {
  try {
    const sessionRes = await supabase.auth.getSession();
    const user = sessionRes?.data?.session?.user;

    if (!user?.id) {
      return null;
    }
    const resp = await supabase  
      .from("users")
      .select("id, username, avatar_url, points, email")
      .eq("id", user.id)
      .limit(1)
      .maybeSingle();

    if (resp.error) {
      console.error("Profile fetch error:", resp.error.message || resp.error);
    }

    const data = resp.data;

    if (Array.isArray(data)) {
      console.warn("Profile fetch returned an array, using first element.", data);
      return (
        data[0] || {
          username: user.email?.split("@")[0] ?? "User",
          points: 0,
          email: user.email,
        }
      );
    } else if (!data) {
      return {
        username: user.email?.split("@")[0] ?? "User",
        points: 0,
        email: user.email,
      };
    } else {
      return data;
    }
  } catch (err) {
    console.error("Unexpected profile load error:", err);
    return null;
  }
};
export const loadQuizStats = async (userId :any) => {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("score, total")
    .eq("user_id", userId);

  if (error) {
    console.error("Error loading quiz stats:", error);
    return { totalQuizzes: 0, averagePercentage: 0 };
  }

  if (!data || data.length === 0) {
    return { totalQuizzes: 0, averagePercentage: 0 };
  }

  const totalQuizzes = data.length;
  const averagePercentage =
    data.reduce((acc, attempt) => acc + (attempt.score / attempt.total) * 100, 0) /
    totalQuizzes;

  return {
    totalQuizzes,
    averagePercentage: Math.round(averagePercentage),
  };
};
