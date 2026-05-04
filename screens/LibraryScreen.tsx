import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { EXERCISES } from '../data/exercises';
import { Difficulty, MuscleGroup } from '../types/workout';
import { getAllBestSets } from '../storage/database';
import { colors } from '../theme';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const MUSCLE_GROUPS: (MuscleGroup | 'all')[] = [
  'all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'core',
];

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  beginner: '#34C759',
  intermediate: '#FF9F0A',
  advanced: '#FF453A',
};

export default function LibraryScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all');
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | 'all'>('all');
  const [bestSets, setBestSets] = useState<Record<string, { weight: number; reps: number }>>({});

  useFocusEffect(useCallback(() => {
    setBestSets(getAllBestSets());
  }, []));

  const filtered = EXERCISES.filter((e) => {
    const diffOk = diffFilter === 'all' || e.difficulty === diffFilter;
    const muscleOk = muscleFilter === 'all' || e.muscleGroup === muscleFilter;
    return diffOk && muscleOk;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.header, { color: c.text }]}>Exercise Library</Text>

      <Text style={[styles.filterLabel, { color: c.muted }]}>Difficulty</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {(['all', ...DIFFICULTIES] as const).map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, { borderColor: c.border, backgroundColor: diffFilter === d ? c.accent : c.card }]}
            onPress={() => setDiffFilter(d)}
          >
            <Text style={{ color: diffFilter === d ? '#fff' : c.text, fontSize: 14 }}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.filterLabel, { color: c.muted }]}>Muscle Group</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {MUSCLE_GROUPS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, { borderColor: c.border, backgroundColor: muscleFilter === item ? c.accent : c.card }]}
            onPress={() => setMuscleFilter(item)}
          >
            <Text style={{ color: muscleFilter === item ? '#fff' : c.text, fontSize: 14 }}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: c.card }]}>
            <View style={styles.cardLeft}>
              <Text style={[styles.name, { color: c.text }]}>{item.name}</Text>
              <Text style={[styles.sub, { color: c.muted }]}>
                {item.muscleGroup} · {item.equipment}
              </Text>
            </View>
            <View style={styles.cardRight}>
              <View style={[styles.badge, { backgroundColor: DIFFICULTY_COLOR[item.difficulty] + '22' }]}>
                <Text style={{ color: DIFFICULTY_COLOR[item.difficulty], fontSize: 12, fontWeight: '600' }}>
                  {item.difficulty}
                </Text>
              </View>
              {bestSets[item.id] ? (
                <Text style={[styles.orm, { color: c.muted }]}>
                  1RM ~{Math.round(bestSets[item.id].weight * (1 + bestSets[item.id].reps / 30))} lbs
                </Text>
              ) : null}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: '700', marginHorizontal: 20, marginTop: 20, marginBottom: 16 },
  filterLabel: { fontSize: 12, fontWeight: '600', marginLeft: 20, marginTop: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  chipScroll: { height: 52 },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 9,
    marginRight: 10,
    flexShrink: 0,
  },
  list: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardLeft: { flex: 1 },
  name: { fontSize: 16, fontWeight: '500' },
  sub: { fontSize: 13, marginTop: 4 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  orm: { fontSize: 11, fontWeight: '500' },
});
