import { supabase } from "../supabase";

export const getAuthSignIn = async (email :string, password: string) => {
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