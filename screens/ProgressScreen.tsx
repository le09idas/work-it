import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { EXERCISES } from '../data/exercises';
import { MuscleGroup } from '../types/workout';
import { getExerciseHistory, getMuscleGroupTotals } from '../storage/database';
import { colors } from '../theme';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32;

const MUSCLE_COLORS: Record<string, string> = {
  chest:     '#0A84FF',
  back:      '#30D158',
  shoulders: '#FF9F0A',
  biceps:    '#BF5AF2',
  triceps:   '#FF453A',
  legs:      '#FFD60A',
  glutes:    '#FF6961',
  core:      '#64D2FF',
};

export default function ProgressScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const nav = useNavigation<any>();
  const [exercisesWithData, setExercisesWithData] = useState<string[]>([]);
  const [muscleData, setMuscleData] = useState<{ muscle: string; sets: number }[]>([]);

  useFocusEffect(
    useCallback(() => {
      const totals = getMuscleGroupTotals();

      // tally by muscle group
      const grouped: Record<string, number> = {};
      for (const [exerciseId, setCount] of Object.entries(totals)) {
        const exercise = EXERCISES.find((e) => e.id === exerciseId);
        if (!exercise) continue;
        grouped[exercise.muscleGroup] = (grouped[exercise.muscleGroup] ?? 0) + setCount;
      }
      const sorted = Object.entries(grouped)
        .map(([muscle, sets]) => ({ muscle, sets }))
        .sort((a, b) => b.sets - a.sets);
      setMuscleData(sorted);

      const withData = EXERCISES.filter((e) => {
        const history = getExerciseHistory(e.id);
        return history.length > 0;
      }).map((e) => e.id);
      setExercisesWithData(withData);
    }, [])
  );

  const tracked = EXERCISES.filter((e) => exercisesWithData.includes(e.id));
  const maxSets = Math.max(...muscleData.map((d) => d.sets), 1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]}>
      <FlatList
        data={tracked}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={[styles.header, { color: c.text }]}>Progress</Text>

            {muscleData.length > 0 && (
              <View style={[styles.chartCard, { backgroundColor: c.card }]}>
                <Text style={[styles.chartTitle, { color: c.text }]}>Sets by Muscle Group</Text>
                <View style={styles.bars}>
                  {muscleData.map(({ muscle, sets }) => {
                    const barW = Math.max((sets / maxSets) * (CHART_WIDTH - 100), 8);
                    const color = MUSCLE_COLORS[muscle] ?? c.accent;
                    return (
                      <View key={muscle} style={styles.barRow}>
                        <Text style={[styles.barLabel, { color: c.muted }]}>
                          {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                        </Text>
                        <View style={styles.barTrack}>
                          <View style={[styles.barFill, { width: barW, backgroundColor: color }]} />
                        </View>
                        <Text style={[styles.barCount, { color: c.muted }]}>{sets}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {tracked.length > 0 && (
              <Text style={[styles.sectionLabel, { color: c.muted }]}>Exercise Progress</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: c.card }]}
            onPress={() => nav.navigate('ExerciseProgress', { exercise: item })}
          >
            <Text style={[styles.name, { color: c.text }]}>{item.name}</Text>
            <Text style={[styles.sub, { color: c.muted }]}>
              {item.muscleGroup} · {item.difficulty}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          muscleData.length === 0 ? (
            <Text style={[styles.empty, { color: c.muted }]}>
              Log some workouts to see your progress here.
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: '700', marginHorizontal: 16, marginTop: 8, marginBottom: 16 },
  chartCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  bars: { gap: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center' },
  barLabel: { fontSize: 13, width: 72 },
  barTrack: { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.08)' },
  barFill: { height: 10, borderRadius: 5 },
  barCount: { fontSize: 12, width: 28, textAlign: 'right' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  list: { paddingBottom: 40 },
  card: { borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  name: { fontSize: 17, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
});
