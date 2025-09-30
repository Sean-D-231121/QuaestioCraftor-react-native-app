import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
function ProfileScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.info}>Name: Sean</Text>
      <Text style={styles.info}>Email:sean@gmail.com</Text>
      <Text style={styles.info}>Points: 120</Text>
      <Button
        title="Edit Profile"
        onPress={() => Alert.alert("Edit Profile")}
      />
      <Button title="Sign Out" onPress={() => navigation.replace("SignIn")} />
    </View>
  );
}
export default ProfileScreen;
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 32, fontWeight: "bold", marginBottom: 20 },
  info: { fontSize: 18, marginBottom: 10 },
});
