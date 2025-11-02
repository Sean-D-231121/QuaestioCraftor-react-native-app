import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

import { getAuthSignIn } from "../services/AuthService";
import { ActivityIndicator, Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";

function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const theme = useTheme();
  const handleSignIn = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    try {
    setLoading(true);
    const { data, error } = await getAuthSignIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    }
  } catch (error: any) {
      setLoading(false);
      setErrorMessage("Something went wrong. Please try again later.");
  
  };
}


  return (
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
          backgroundColor: theme.colors.background,
        }}
      >
        <Image
          source={require("../assets/Logo.png")}
          style={{
            width: 200,
            height: 260,
            alignSelf: "center",
            marginBottom: 30,
          }}
        />

        <Text
          variant="headlineLarge"
          style={{
            textAlign: "center",
            color: theme.colors.secondary,
            marginBottom: 20,
            fontWeight: "bold",
          }}
        >
          Welcome Back
        </Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginBottom: 16, backgroundColor: '#EDE7F6' }}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your Password"
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ marginBottom: 8, backgroundColor: '#EDE7F6' }}
    
        />

        {errorMessage ? (
          <HelperText type="error" visible={true}>
            {errorMessage}
          </HelperText>
        ) : null}

        <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>

        <Button
          mode="text"
          onPress={() => navigation.navigate("SignUp")}
          style={{ marginTop: 12 }}
          
        >
          Don’t have an account? Sign Up
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 18, fontWeight: '700', color: '#1A1A60', marginBottom: 8 },
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
    backgroundColor: "#1A1A60",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  primaryButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  buttonDisabled: { opacity: 0.6 },
  link: { marginTop: 18, color: "#6C63FF", textAlign: "center" },

});
