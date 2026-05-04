import React from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { WorkoutSession } from '../types/workout';
import { colors } from '../theme';

export default function SessionDetailScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const route = useRoute<any>();
  const session: WorkoutSession = route.params.session;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.title, { color: c.text }]}>{session.templateName}</Text>
      <Text style={[styles.date, { color: c.muted }]}>{formatDate(session.date)}</Text>

      <FlatList
        data={session.exercises}
        keyExtractor={(el) => el.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: exLog }) => (
          <View style={[styles.card, { backgroundColor: c.card }]}>
            <Text style={[styles.exerciseName, { color: c.text }]}>{exLog.exercise.name}</Text>

            <View style={styles.setHeader}>
              <Text style={[styles.colLabel, { color: c.muted, flex: 0.5 }]}>SET</Text>
              <Text style={[styles.colLabel, { color: c.muted }]}>WEIGHT</Text>
              <Text style={[styles.colLabel, { color: c.muted }]}>REPS</Text>
            </View>

            {exLog.sets.map((set) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={[styles.setNum, { color: c.muted }]}>{set.setNumber}</Text>
                <Text style={[styles.setVal, { color: c.text }]}>{set.weight} lbs</Text>
                <Text style={[styles.setVal, { color: c.text }]}>{set.reps}</Text>
              </View>
            ))}

            {exLog.sets.length === 0 && (
              <Text style={[styles.noSets, { color: c.muted }]}>No sets logged</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', margin: 20, marginBottom: 4 },
  date: { fontSize: 14, marginLeft: 20, marginBottom: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  exerciseName: { fontSize: 17, fontWeight: '600', marginBottom: 10 },
  setHeader: { flexDirection: 'row', marginBottom: 4 },
  colLabel: { flex: 1, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  setRow: { flexDirection: 'row', paddingVertical: 4 },
  setNum: { flex: 0.5, fontSize: 14 },
  setVal: { flex: 1, fontSize: 14 },
  noSets: { fontSize: 13 },
});
