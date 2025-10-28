import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../supabase";
import { loadProfile, loadQuizStats } from "../services/ProfileService";
import { loadUserQuizHistory } from "../services/Quizapi";

function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"history" | "personal">("history");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalQuizzes: 0, averagePercentage: 0 });
  const [quizhistory, setQuizHistory] = useState<any[]>([]);
  useEffect(() => {
    fetchProfile();
  }, []);

    const fetchProfile = async () => {
  setLoading(true);
  const data = await loadProfile();
  if (data) {
    setProfile(data);
    const quizStats = await loadQuizStats(data.id); // 👈 use user id
    const history = await loadUserQuizHistory(data.id); // 👈 load quiz history
    setStats(quizStats);
    setQuizHistory(history);
  }
  setLoading(false);
};

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.replace("SignIn");
  };

  const handleEdit = () => {
    Alert.alert("Edit Profile", "Edit profile tapped");
  };

  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={{ alignItems: "center" }}>
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}

        <View style={styles.usernameRow}>
          <Text style={styles.username}>{profile?.username ?? "User"}</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>quizzes{"\n"}Completed</Text>
          <Text style={styles.statValue}>{stats.totalQuizzes}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Points</Text>
          <Text style={styles.statValue}>{profile?.points ?? 0}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Percentage</Text>
          <Text style={styles.statValue}>{stats.averagePercentage}%</Text>
        </View>
      </View>

      <View style={styles.segment}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === "history" && styles.segmentActive,
          ]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "history" && styles.segmentTextActive,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === "personal" && styles.segmentActive,
          ]}
          onPress={() => setActiveTab("personal")}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "personal" && styles.segmentTextActive,
            ]}
          >
            Personal info
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "history" ? (
        <View style={{ width: "100%", paddingTop: 12 }}>
          {quizhistory.length > 0 ? (
            quizhistory.map((q) => (
              <View key={q.id} style={styles.quizCard}>
                <Text style={styles.quizTitle}>{q.title}</Text>
                <View style={styles.quizFooter}>
                  <Text style={styles.quizMeta}>Questions : {q.questions}</Text>
                  <Text style={styles.quizMeta}>Score : {q.score}</Text>
                </View>
              </View>
              ))
            ) : (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#1A1A60" }}>
              No quiz history yet.
              </Text>
            )}
        </View>
      ) : (
        <View style={{ width: "100%", paddingTop: 12 }}>
          <View style={styles.infoCard}>
            <Text >Email</Text>
            <Text >{profile?.email ?? "—"}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 18,
    color: "#000",
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#ddd",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#ddd",
    marginBottom: 12,
  },
  usernameRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  username: { fontSize: 22, fontWeight: "700", color: "#1A1A60" },
  editButton: { marginLeft: 8, padding: 6 },
  editIcon: { color: "#1A1A60", fontSize: 16 },

  statsCard: {
    width: "100%",
    backgroundColor: "#EDE7F6",
    borderRadius: 12,
    marginTop: 18,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statBlock: { flex: 1, alignItems: "center", paddingVertical: 12 },
  statLabel: { color: "#1A1A60", fontSize: 14, textAlign: "center" },
  statValue: {
    color: "#1A1A60",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
  },
  statDivider: { width: 1, backgroundColor: "#D9D0FF", height: 70 },

  segment: {
    flexDirection: "row",
    width: "100%",
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#EDE7F6",
    alignItems: "center",
  },
  segmentActive: { backgroundColor: "#6C63FF" },
  segmentText: { color: "#1A1A60", fontWeight: "700" },
  segmentTextActive: { color: "#fff" },

  quizCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#6C63FF",
    borderWidth: 0,
    overflow: "hidden",
    marginBottom: 14,
    elevation: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A60",
    padding: 16,
    backgroundColor: "#EDE7F6",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  quizFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#6C63FF",
  },
  quizMeta: { color: "#fff", fontWeight: "700" },

  infoCard: { backgroundColor: "#fff", padding: 16, borderRadius: 12 },

  signOutButton: {
    backgroundColor: "#1A1A60",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 18,
    width: "100%",
    alignItems: "center",
  },
  signOutText: { color: "#fff", fontWeight: "700" },
});
