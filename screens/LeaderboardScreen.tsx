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


  // Top 3 for podium
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

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
        {topThree.map((user, idx) => {
          const isCenter = idx === 0; // podium center is top
          return (
            <View
              key={user.id || idx}
              style={isCenter ? styles.podiumItemCenter : styles.podiumItem}
            >
              <Image
                source={{ uri: user.avatar_url }}
                style={[styles.circle, isCenter ? styles.centerCircle : styles.smallCircle]}
              />
              <View
                style={[
                  styles.badge,
                  idx === 0 ? styles.badgeCenter : idx === 1 ? styles.badgeLeft : styles.badgeRight,
                ]}
              >
                <Text style={styles.badgeText}>{idx + 1}</Text>
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
});
