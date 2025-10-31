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
export const updateAvatar = async (fileUri: string) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session || !session.user?.id) throw new Error('User not signed in');

  const userId = session.user.id;

  const fileExt = fileUri.split('.').pop() || 'jpg';
  const fileName = `${userId}.${fileExt}`;

  // Fetch image
  const resp = await fetch(fileUri);
  if (!resp.ok) throw new Error('Failed to fetch image');

  const contentType = resp.headers.get('content-type') || `image/${fileExt}`;
  const arrayBuffer = await resp.arrayBuffer();
  const file = new Uint8Array(arrayBuffer);

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true, contentType });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(fileName);
  const publicUrl = publicData.publicUrl;

  // Update user table
  const { data: updated, error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('auth_id', userId)
    .select();

  if (updateError) throw updateError;

  return publicUrl;
};
