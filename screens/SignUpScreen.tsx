// screens/SignUpScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { supabase } from "../supabase"; 

function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user?.id, 
          username,
          email,
          points: 0,
        },
      ]);

      if (insertError) throw insertError;

      Alert.alert(
        "Success",
        "Account created successfully! Please check your email to confirm."
      );
      navigation.replace("Dashboard");
    } catch (err: any) {
      console.error("Sign up error:", err.message);
      Alert.alert("Sign up failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title={loading ? "Creating Account..." : "Create Account"}
        onPress={handleSignUp}
        disabled={loading}
      />

      <Text onPress={() => navigation.navigate("SignIn")} style={styles.link}>
        Already have an account? Sign in
      </Text>
    </View>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  link: { marginTop: 15, color: "#4A90E2", textAlign: "center" },
});
