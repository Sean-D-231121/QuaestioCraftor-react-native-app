// screens/SignUpScreen.tsx
import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { getAuthSignUp } from "../services/AuthService";
import * as ImagePicker from "expo-image-picker";
function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setAvatar(file);
    }
  };

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    setLoading(true);
    const fileToUpload = avatar
      ? {
          uri: avatar.uri,
          name: avatar.uri.split("/").pop(),
          type: "image/jpeg",
        }
      : undefined;

    const { data, error } = await getAuthSignUp(
      username,
      email,
      password,
      fileToUpload as any
    );
    setLoading(false);

    if (error) {
      Alert.alert("Sign up failed", error.message || "Something went wrong.");
    } else {
      Alert.alert("Success", "Account created successfully!");
      navigation.replace("Dashboard");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TouchableOpacity onPress={pickAvatar}>
        {avatar ? (
          <Image source={{ uri: avatar.uri }} style={styles.avatarPreview} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={{ color: "#6C63FF" }}>Pick an avatar</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.label}>Username</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor="#8a7fa8"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="you@example.com"
        placeholderTextColor="#8a7fa8"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        placeholderTextColor="#8a7fa8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Creating Account..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate("SignIn")} style={styles.link}>
        Already have an account? Sign in
      </Text>
    </ScrollView>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1A1A60",
  },
  label: { fontSize: 20, fontWeight: "700", color: "#1A1A60", marginBottom: 8 },
  input: {
    backgroundColor: "#EDE7F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    color: "#1A1A60",
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
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    backgroundColor: "#EDE7F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
