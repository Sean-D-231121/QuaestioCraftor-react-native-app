import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

import { getAuthSignIn } from "../services/AuthService";

function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    const { data, error } = await getAuthSignIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Sign In Error", error.message);
    } else {
      navigation.replace("Dashboard");
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/Logo.png")}
        style={{ width: 200, height: 260, alignSelf: "center", marginBottom: 40 }}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="you@example.com"
        placeholderTextColor="#8a7fa8"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        placeholderTextColor="#8a7fa8"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSignIn}
        activeOpacity={0.85}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>{loading ? "Signing In..." : "Sign in"}</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate("SignUp")} style={styles.link}>
        Don’t have an account? Sign Up
      </Text>
    </ScrollView>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 28, fontWeight: '700', color: '#1A1A60', marginBottom: 8 },
  input: {
    backgroundColor: '#EDE7F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    color: '#1A1A60',
  },
  primaryButton: {
    backgroundColor: '#1A1A60',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  link: { marginTop: 18, color: '#6C63FF', textAlign: 'center' },
});
