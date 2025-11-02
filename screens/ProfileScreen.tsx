import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabase";
import {
  loadProfile,
  loadQuizStats,
  updateAvatar,
} from "../services/ProfileService";
import { loadUserQuizHistory } from "../services/Quizapi";
import { Card, Text } from "react-native-paper";

function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"history" | "personal">("history");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalQuizzes: 0, averagePercentage: 0 });
  const [quizhistory, setQuizHistory] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchProfile();
    const interval = setInterval(() => {
      fetchProfile();
    }, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const data = await loadProfile();
    if (data) {
      setProfile(data);
      const quizStats = await loadQuizStats(data.id);
      const history = await loadUserQuizHistory(data.id); // load quiz history
      setStats(quizStats);
      setQuizHistory(history);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.replace("SignIn");
  };
  const handleChangeAvatar = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (pickerResult.canceled || !pickerResult.assets?.length) return;

      const uri = pickerResult.assets[0].uri;
      const publicUrl = await updateAvatar(uri);

      setProfile({ ...profile, avatar_url: publicUrl });
      Alert.alert("Success", "Profile picture updated!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update avatar.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={handleChangeAvatar}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </TouchableOpacity>

        <View style={styles.usernameRow}>
          <Text style={styles.username}>{profile?.username ?? "User"}</Text>
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
        <View style={{ width: "100%", marginTop: 16 }}>
          {quizhistory.length > 0 ? (
            <>
              <ScrollView
                style={styles.quizHistoryScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                {(showAll ? quizhistory : quizhistory.slice(0, 5)).map((q) => (
                  <Card key={q.id} style={styles.quizCard} mode="outlined">
                    <Card.Title
                      title={q.title}
                      titleVariant="titleMedium"
                      titleStyle={{ color: "#1A1A60" }}
                    />
                    <Card.Content>
                      <Text>Questions: {q.questions}</Text>
                      <Text>Score: {q.score}</Text>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>

              {quizhistory.length > 5 && (
                <TouchableOpacity
                  onPress={() => setShowAll((prev) => !prev)}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllText}>
                    {showAll ? "Show Less" : "View All"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text
              variant="bodyLarge"
              style={{ textAlign: "center", marginTop: 20, color: "#1A1A60" }}
            >
              No quiz history yet.
            </Text>
          )}
        </View>
      ) : (
        <>
          <Card style={{ width: "100%", marginTop: 16 }}>
            <Card.Content>
              <Text variant="bodyMedium">Username</Text>
              <Text variant="titleSmall">{profile?.username ?? "—"}</Text>
            </Card.Content>
          </Card>
          <Card style={{ width: "100%", marginTop: 16 }}>
            <Card.Content>
              <Text variant="bodyMedium">Email</Text>
              <Text variant="titleSmall">{profile?.email ?? "—"}</Text>
            </Card.Content>
          </Card>
        </>
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
    marginBottom: 18,
    color: "#1A1A60",
    marginTop: Platform.OS === "ios" ? 40 : 10,
  },
  avatar: {
    width: 120,
    height: 120,
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
  statBlock: { flex: 1, alignItems: "center", paddingVertical: 5 },
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
    backgroundColor: "#EDE7F6",
    borderRadius: 12,
    borderColor: "#6C63FF",
    borderWidth: 0,
    overflow: "hidden",
    marginBottom: 14,
    elevation: 1,
  },

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
  quizHistoryScroll: {
    maxHeight: 300, // adjust based on your design
    marginBottom: 10,
  },
  signOutText: { color: "#fff", fontWeight: "700" },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  viewAllText: {
    color: "#6C63FF",
    fontWeight: "600",
    fontSize: 16,
  },
});
