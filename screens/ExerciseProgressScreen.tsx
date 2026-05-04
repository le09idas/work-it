import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Exercise } from '../types/workout';
import { getExerciseHistory } from '../storage/database';
import { colors } from '../theme';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 160;
const CHART_PAD = 20;

type HistoryRow = { date: string; weight: number; reps: number; setNumber: number };

export default function ExerciseProgressScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const route = useRoute<any>();
  const exercise: Exercise = route.params.exercise;
  const [history, setHistory] = useState<HistoryRow[]>([]);

  useEffect(() => {
    setHistory(getExerciseHistory(exercise.id) as HistoryRow[]);
  }, [exercise.id]);

  const maxWeights = groupByDate(history);

  const maxW = Math.max(...maxWeights.map((d) => d.weight), 1);
  const chartWidth = width - 32;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.title, { color: c.text }]}>{exercise.name}</Text>
      <Text style={[styles.sub, { color: c.muted }]}>
        {exercise.muscleGroup} · {exercise.difficulty}
      </Text>

      {maxWeights.length > 1 && (
        <View style={[styles.chartContainer, { backgroundColor: c.card }]}>
          <Text style={[styles.chartTitle, { color: c.muted }]}>Max Weight (lbs)</Text>
          <View style={{ height: CHART_HEIGHT, width: chartWidth - CHART_PAD * 2 }}>
            {maxWeights.map((d, i) => {
              const x = (i / (maxWeights.length - 1)) * (chartWidth - CHART_PAD * 2);
              const y = CHART_HEIGHT - (d.weight / maxW) * CHART_HEIGHT;
              return (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { left: x - 5, top: y - 5, backgroundColor: c.accent },
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.chartLabels}>
            <Text style={[styles.chartLabel, { color: c.muted }]}>
              {formatDate(maxWeights[0]?.date)}
            </Text>
            <Text style={[styles.chartLabel, { color: c.muted }]}>
              {formatDate(maxWeights[maxWeights.length - 1]?.date)}
            </Text>
          </View>
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: c.text }]}>Session Log</Text>
      <FlatList
        data={groupByDate(history)}
        keyExtractor={(d) => d.date}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: c.card }]}>
            <Text style={[styles.dateLabel, { color: c.muted }]}>{formatDate(item.date)}</Text>
            <Text style={[styles.weightText, { color: c.text }]}>{item.weight} lbs</Text>
            <Text style={[styles.repsText, { color: c.muted }]}>{item.reps} reps (best set)</Text>
          </View>
        )}
      />
    </View>
  );
}

function groupByDate(rows: HistoryRow[]) {
  const map = new Map<string, { date: string; weight: number; reps: number }>();
  for (const r of rows) {
    const day = r.date.slice(0, 10);
    const existing = map.get(day);
    if (!existing || r.weight > existing.weight) {
      map.set(day, { date: r.date, weight: r.weight, reps: r.reps });
    }
  }
  return Array.from(map.values());
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', margin: 20, marginBottom: 4 },
  sub: { fontSize: 14, marginLeft: 20, marginBottom: 16 },
  chartContainer: { margin: 16, borderRadius: 12, padding: CHART_PAD },
  chartTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12 },
  dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  chartLabel: { fontSize: 11 },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginLeft: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  dateLabel: { flex: 1, fontSize: 13 },
  weightText: { fontSize: 17, fontWeight: '700', marginRight: 8 },
  repsText: { fontSize: 13 },
});
