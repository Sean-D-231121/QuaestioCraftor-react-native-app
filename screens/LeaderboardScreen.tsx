import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import { fetchLeaderboard } from "../services/QuizAttemptAPI";

export default function LeaderboardScreen({ navigation }: any) {
  const [filter, setFilter] = useState<"Today" | "Weekly" | "All time">("Weekly");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

 useEffect(() => {
  fetchLeaderboard(filter).then(setLeaderboard).catch(console.error);
}, [filter]);




  const sortedLeaderboard = [...leaderboard].sort((a, b) => a.rank - b.rank);
  const topThree = sortedLeaderboard.slice(0, 3);
  
  const podiumOrder = [
  topThree.find(u => u.rank === 2) || topThree[1], 
  topThree.find(u => u.rank === 1) || topThree[0],
  topThree.find(u => u.rank === 3) || topThree[2],
].filter(Boolean);
  const rest = sortedLeaderboard.slice(3,9);
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Leaderboards</Text>

      <View style={styles.filterRow}>
        {["Today", "Weekly", "All time"].map((f) => (
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
  {podiumOrder.map((user) => {
    let style, circleStyle, badgeStyle;

    if (user.rank === 1) { // 1st place
      style = styles.podiumItemCenter;
      circleStyle = styles.centerCircle;
      badgeStyle = styles.badgeCenter;
    } else if (user.rank === 2) { // 2nd place
      style = styles.podiumItemLeft;
      circleStyle = styles.smallCircle;
      badgeStyle = styles.badgeLeft;
    } else { // 3rd place
      style = styles.podiumItemRight;
      circleStyle = styles.smallCircle;
      badgeStyle = styles.badgeRight;
    }

    return (
      <View key={user.id} style={style}>
        <Image source={{ uri: user.avatar_url }} style={[styles.circle, circleStyle]} />
        <View style={[styles.badge, badgeStyle]}>
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
              <Image source={{ uri: r.avatar_url }} style={styles.avatarSmall} />
              <Text>{r.username}</Text>
            </View>
            <Text style={styles.rankPoints}>{r.points}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", paddingBottom: 120 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", color: "#1A1A60", marginTop: 8 },
  filterRow: { flexDirection: "row", justifyContent: "center", marginTop: 18, marginBottom: 10 },
  filterButton: { backgroundColor: "#EDE7F6", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, marginHorizontal: 8 },
  filterActive: { backgroundColor: "#E0D7FF" },
  filterText: { color: "#1A1A60", fontWeight: "600" },
  filterTextActive: { color: "#1A1A60" },

  podiumRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", marginTop: 22, marginBottom: 28 },
  podiumItem: { alignItems: "center", width: 90 },
  podiumItemCenter: { alignItems: "center", width: 150 },
  circle: { borderRadius: 999, borderWidth: 3, borderColor: "#1A1A60" },
  smallCircle: { width: 80, height: 80 },
  centerCircle: { width: 140, height: 140 },
  badge: { position: "absolute", backgroundColor: "#fff", borderRadius: 20, borderWidth: 2, borderColor: "#1A1A60", width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  badgeLeft: { bottom: -12, left: 6 },
  badgeCenter: { bottom: -14, alignSelf: "center" },
  badgeRight: { bottom: -12, right: 6 },
  badgeText: { color: "#1A1A60", fontWeight: "700" },

  listContainer: { marginTop: 10 },
  rankRow: { backgroundColor: "#EDE7F6", paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  rankLeft: { flexDirection: "row", alignItems: "center" },
  rankNumber: { fontSize: 18, fontWeight: "700", color: "#1A1A60", marginRight: 12 },
  rankPoints: { fontSize: 18, fontWeight: "800", color: "#1A1A60" },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  podiumItemLeft: { alignItems: "center", width: 120, marginBottom: 10 },
  podiumItemRight: { alignItems: "center", width: 120, marginBottom: 10 },
});
