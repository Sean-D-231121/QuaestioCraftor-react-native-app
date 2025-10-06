import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { supabase } from "../supabase"; 

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Sign In Error", error.message);
    } else {
      navigation.replace("Dashboard");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Logo.png")}
        style={{
          width: 200,
          height: 260,
          alignSelf: "center",
          marginBottom: 50,
        }}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.signInButton}>
        <Button
          title={loading ? "Signing In..." : "Sign In"}
          onPress={handleSignIn}
          disabled={loading}
          
        />
      </View>
      <Text onPress={() => navigation.navigate("SignUp")} style={styles.link}>
        Don’t have an account? Sign Up
      </Text>
    </View>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  signInButton: { marginTop: 20, width: "80%", alignSelf: "center", color },
  link: { marginTop: 15, color: "#4A90E2", textAlign: "center" },
});
