
import React, { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

const topThree = [
    { id: "2", rank: 2 },
    { id: "1", rank: 1 },
    { id: "3", rank: 3 },
];

const rest = [
    { rank: 4,username:"James" , points: 1500 },
    { rank: 5,username:"Matthew" , points: 1400 },
    { rank: 6,username:"Kayla" , points: 1300 },
    { rank: 7,username: "Michael" , points: 1200 },
    { rank: 8,username: "John" , points: 1100 },
    { rank: 9,username: "Samuel" , points: 1000 },
];

function LeaderboardScreen({ navigation }: any) {
    const [filter, setFilter] = useState("Weekly");

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Leaderboards</Text>

            <View style={styles.filterRow}>
                {["Today", "Weekly", "All time"].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterButton, filter === f && styles.filterActive]}
                        onPress={() => setFilter(f)}
                        activeOpacity={0.85}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.podiumRow}>
                <View style={styles.podiumItem}>
                    <View style={[styles.circle, styles.smallCircle]} />
                    <View style={[styles.badge, styles.badgeLeft]}>
                        <Text style={styles.badgeText}>2</Text>
                    </View>
                </View>

                
                <View style={styles.podiumItemCenter}>
                    <View style={[styles.circle, styles.centerCircle]} />
                    <View style={[styles.badge, styles.badgeCenter]}>
                        <Text style={styles.badgeText}>1</Text>
                    </View>
                </View>

               
                <View style={styles.podiumItem}>
                    <View style={[styles.circle, styles.smallCircle]} />
                    <View style={[styles.badge, styles.badgeRight]}>
                        <Text style={styles.badgeText}>3</Text>
                    </View>
                </View>
            </View>

            <View style={styles.listContainer}>
                {rest.map((r) => (
                    <View key={r.rank} style={styles.rankRow}>
                        <View style={styles.rankLeft}>
                            <Text style={styles.rankNumber}>{r.rank}</Text>
                            <Text>{r.username}</Text>
                        </View>
                        <Text style={styles.rankPoints}>{r.points}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default LeaderboardScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#fff', paddingBottom: 120 },
    title: { fontSize: 24, fontWeight: '700', textAlign: 'center', color: '#1A1A60', marginTop: 8 },
    filterRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18, marginBottom: 10 },
    filterButton: {
        backgroundColor: '#EDE7F6',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 8,
    },
    filterActive: { backgroundColor: '#E0D7FF' },
    filterText: { color: '#1A1A60', fontWeight: '600' },
    filterTextActive: { color: '#1A1A60' },

    podiumRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginTop: 22, marginBottom: 28 },
    podiumItem: { alignItems: 'center', width: 90 },
    podiumItemCenter: { alignItems: 'center', width: 150 },
    circle: { backgroundColor: '#ddd', borderRadius: 999, borderWidth: 3, borderColor: '#1A1A60' },
    smallCircle: { width: 80, height: 80 },
    centerCircle: { width: 140, height: 140 },
    badge: { position: 'absolute', backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, borderColor: '#1A1A60', width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    badgeLeft: { bottom: -12, left: 6 },
    badgeCenter: { bottom: -14, alignSelf: 'center' },
    badgeRight: { bottom: -12, right: 6 },
    badgeText: { color: '#1A1A60', fontWeight: '700' },

    listContainer: { marginTop: 10 },
    rankRow: { backgroundColor: '#EDE7F6', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    rankLeft: { flexDirection: 'row', alignItems: 'center' },
    rankNumber: { fontSize: 18, fontWeight: '700', color: '#1A1A60', marginRight: 12 },
    rankPoints: { fontSize: 18, fontWeight: '800', color: '#1A1A60' },
});