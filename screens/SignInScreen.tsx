// screens/SignInScreen.js
import React from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";


function SignInScreen({ navigation } :any) {

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Button title="Sign In" onPress={() => navigation.replace("Dashboard")} />
      <Text onPress={() => navigation.navigate("SignUp")} style={styles.link}>
        Don’t have an account? Sign Up
      </Text>
    </View>
  );
}
export default SignInScreen;

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
