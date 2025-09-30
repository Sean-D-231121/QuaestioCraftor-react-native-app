// screens/SignUpScreen.js
import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";

function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (!username || !email || !password) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    // Simulate user creation (replace with actual API call or DB logic)
    const newUser = {
      username,
      email,
      password,
      created_at: new Date().toISOString(),
      points: 0,
    };

    console.log("User signed up:", newUser);
    navigation.replace("Dashboard");
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
      <Button title="Create Account" onPress={handleSignUp} />
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
