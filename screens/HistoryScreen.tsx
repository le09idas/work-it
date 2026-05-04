import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getSessions } from '../storage/database';
import { WorkoutSession } from '../types/workout';
import { colors } from '../theme';

export default function HistoryScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const nav = useNavigation<any>();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useFocusEffect(
    useCallback(() => {
      setSessions(getSessions());
    }, [])
  );

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    return m > 0 ? `${m} min` : `${seconds}s`;
  }

  function totalSets(session: WorkoutSession) {
    return session.exercises.reduce((acc, e) => acc + e.sets.length, 0);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.header, { color: c.text }]}>History</Text>

      <FlatList
        data={sessions}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: c.card }]}
            onPress={() => nav.navigate('SessionDetail', { session: item })}
          >
            <Text style={[styles.templateName, { color: c.text }]}>{item.templateName}</Text>
            <Text style={[styles.date, { color: c.muted }]}>{formatDate(item.date)}</Text>
            <View style={styles.stats}>
              <Text style={[styles.stat, { color: c.muted }]}>
                {item.exercises.length} exercises
              </Text>
              <Text style={[styles.stat, { color: c.muted }]}>
                {totalSets(item)} sets
              </Text>
              {item.durationSeconds > 0 && (
                <Text style={[styles.stat, { color: c.muted }]}>
                  {formatDuration(item.durationSeconds)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: c.muted }]}>
            No workouts logged yet. Start one from Home!
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: '700', margin: 20, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  templateName: { fontSize: 18, fontWeight: '600' },
  date: { fontSize: 13, marginTop: 2, marginBottom: 8 },
  stats: { flexDirection: 'row', gap: 16 },
  stat: { fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
});
