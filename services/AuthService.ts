
import { supabase } from "../supabase";

export const getAuthSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign-in error:", error.message);
    return { error };
  }

  return { data };
};

export const getAuthSignUp = async (
  username: string,
  email: string,
  password: string,
  avatarFile?: File 
) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Sign-up error:", error.message);
      return { error };
    }

    const user = data.user;
    let avatarUrl = null;

   
    if (avatarFile && user) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });
      if (uploadError) throw uploadError;
      
      const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
      avatarUrl = publicData?.publicUrl || null;
    }


    
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: user?.id,
        username,
        email,
        points: 0,
        avatar_url: avatarUrl,
      },
    ]);

    if (insertError) {
      console.error("User insert error:", insertError.message);
      return { error: insertError };
    }

    return { data };
  } catch (err: any) {
    console.error("Unexpected error during sign-up:", err.message);
    return { error: err };
  }
};
