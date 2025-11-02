import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import "../assets/Blank-image.jpg";
import { fetchLeaderboard } from "../services/QuizAttemptAPI";

export default function LeaderboardScreen({ navigation }: any) {
  const [filter, setFilter] = useState<"Today" | "Weekly" | "All time">("Weekly");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    setLeaderboard([]); 
    fetchLeaderboard(filter)
      .then(setLeaderboard)
      .catch(console.error);
  }, [filter]);

  const { width } = Dimensions.get("window");
  const circleBase = width * 0.25;

  // Sort and select top three
  const sortedLeaderboard = [...leaderboard].sort((a, b) => a.rank - b.rank);
  const topThree = sortedLeaderboard.slice(0, 3);

  // Fill podium placeholders
  const podiumOrder = [
    topThree.find(u => u.rank === 2) || { id: "vacant-2", username: "No ranked player yet", avatar_url: "", rank: 2 },
    topThree.find(u => u.rank === 1) || { id: "vacant-1", username: "No ranked player yet", avatar_url: "", rank: 1 },
    topThree.find(u => u.rank === 3) || { id: "vacant-3", username: "No ranked player yet", avatar_url: "", rank: 3 },
  ];

  
  const rest = [...sortedLeaderboard.slice(3, 9)];
  while (rest.length < 6) {
    rest.push({
      id: `vacant-${rest.length + 4}`,
      username: "No ranked player yet",
      avatar_url: "",
      points: 0,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Leaderboards</Text>

      <View style={styles.filterRow}>
        {["Today", "Weekly", "All time"].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterActive]}
            onPress={() => setFilter(f as any)}
            activeOpacity={0.85}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.podiumRow}>
        {podiumOrder.map(user => {
          let circleSize = user.rank === 1 ? circleBase * 1.4 : circleBase;
          let marginTop = user.rank === 1 ? 0 : 20;

          return (
            <View key={user.id} style={[styles.podiumItem, { marginTop, width: circleSize * 1.1 }]}>
              <Image
                source={user.avatar_url ? { uri: user.avatar_url } : require("../assets/Blank-image.jpg")}
                style={[styles.circle, { width: circleSize, height: circleSize }]}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{user.rank}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.listContainer}>
        {rest.map((r, index) => (
          <View key={r.id} style={styles.rankRow}>
            <View style={styles.rankLeft}>
              <Text style={styles.rankNumber}>{index + 4}</Text>
              <Image
                source={r.avatar_url ? { uri: r.avatar_url } : require("../assets/Blank-image.jpg")}
                style={styles.avatarSmall}
              />
              <Text>{r.username}</Text>
            </View>
            <Text style={styles.rankPoints}>{r.points || 0}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#1A1A60",
    marginTop: 8,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: "#EDE7F6",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  filterActive: {
    backgroundColor: "#E0D7FF",
  },
  filterText: {
    color: "#1A1A60",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#1A1A60",
  },

  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginTop: 22,
    marginBottom: 28,
    width: "100%",
  },
  podiumItem: {
    alignItems: "center",
  },
  circle: {
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "#1A1A60",
  },
  badge: {
    position: "absolute",
    bottom: -12,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1A1A60",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#1A1A60",
    fontWeight: "700",
  },
  username: {
    marginTop: 10,
    fontWeight: "600",
    color: "#1A1A60",
    textAlign: "center",
  },
  listContainer: { marginTop: 10 },
  rankRow: {
    backgroundColor: "#EDE7F6",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rankLeft: { flexDirection: "row", alignItems: "center" },
  rankNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A60",
    marginRight: 12,
  },
  rankPoints: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A60",
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
});
