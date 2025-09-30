
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const leaderboardData = [
    { id: "1", username: "Alice", points: 1500 },
    { id: "2", username: "Bob", points: 1200 },
    { id: "3", username: "Charlie", points: 1100 },
    { id: "4", username: "David", points: 900 },
    { id: "5", username: "Eve", points: 850 },
];

function LeaderboardScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top Players</Text>
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <View style={styles.item}>
                    <Text style={styles.rank}>{index + 1}</Text>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.points}>{item.points} pts</Text>
                </View>
            )}
        />
    </View>
  );
}
export default LeaderboardScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
    subtitle: { fontSize: 20, marginBottom: 20 },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    rank: { fontSize: 16, fontWeight: "bold" },
    username: { fontSize: 16 },
    points: { fontSize: 16, fontWeight: "600" },
});