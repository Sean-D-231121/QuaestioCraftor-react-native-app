import React, { useEffect, useState } from "react";
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

function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"history" | "personal">("history");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Get current authenticated user (session)
      const sessionRes = await supabase.auth.getSession();
      const user = sessionRes?.data?.session?.user;
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Fetch profile from users table. Use limit(1).maybeSingle() to avoid
      // errors when multiple rows are present and to safely return null if none.
      const resp = await supabase
        .from("users")
        .select("id, username, avatar_url, points, email")
        .eq("id", user.id)
        .limit(1)
        .maybeSingle();

      
      if (resp.error) {
        console.log("Profile fetch response:", resp);
        console.error("Profile fetch error:", resp.error.message || resp.error);
      }

      const data = resp.data;
      console.log("Profile fetch response:", data);
      
      if (Array.isArray(data)) {
        console.warn("Profile fetch returned an array, using first element.", data);
        setProfile(data[0] || {
          username: user.email?.split("@")[0] ?? "User",
          points: 0,
          email: user.email,
        });
      } else if (!data) {
        
        setProfile({
          username: user.email?.split("@")[0] ?? "User",
          points: 0,
          email: user.email,
        });
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Unexpected profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.replace("SignIn");
  };

  const handleEdit = () => {
    Alert.alert("Edit Profile", "Edit profile tapped");
  };

  
  const recentQuizzes = [
    {
      id: "q1",
      title: "Understanding mitochondria test",
      questions: 15,
      score: "13/15",
    },
  ];

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
          <Text style={styles.statValue}>500</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Points</Text>
          <Text style={styles.statValue}>{profile?.points ?? 0}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Percentage</Text>
          <Text style={styles.statValue}>80%</Text>
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
          {recentQuizzes.map((q) => (
            <View key={q.id} style={styles.quizCard}>
              <Text style={styles.quizTitle}>{q.title}</Text>
              <View style={styles.quizFooter}>
                <Text style={styles.quizMeta}>Questions : {q.questions}</Text>
                <Text style={styles.quizMeta}>Score : {q.score}</Text>
              </View>
            </View>
          ))}
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
