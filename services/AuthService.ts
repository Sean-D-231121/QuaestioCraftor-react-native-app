
import { supabase } from "../supabase";
import * as FileSystem from "expo-file-system/legacy";
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
  avatarFile?: any
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
      const base64 = await FileSystem.readAsStringAsync(avatarFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileExt = avatarFile.name?.split(".").pop() || "jpg";
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Convert base64 to Uint8Array
      const imageBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, imageBuffer, {
          contentType: avatarFile.type || "image/jpeg",
          upsert: true,
        });

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
        auth_id: user?.id  
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


