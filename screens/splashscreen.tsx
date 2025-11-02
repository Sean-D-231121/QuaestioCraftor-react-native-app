import React from "react";
import { ActivityIndicator, View, Image, Text, StyleSheet} from "react-native";


function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      {/* Replace with your logo if needed */}
      <Image source={require("../assets/Logo.png")} style={styles.logo} />
      <Text style={styles.appName}>QuaestioCraftor</Text>
      <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 20 }} />
    </View>
  );
}
export default SplashScreen;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9FF",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#6C63FF",
  },
});