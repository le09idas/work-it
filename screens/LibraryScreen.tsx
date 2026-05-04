import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { EXERCISES } from '../data/exercises';
import { Difficulty, MuscleGroup } from '../types/workout';
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

  const filtered = EXERCISES.filter((e) => {
    const diffOk = diffFilter === 'all' || e.difficulty === diffFilter;
    const muscleOk = muscleFilter === 'all' || e.muscleGroup === muscleFilter;
    return diffOk && muscleOk;
  });

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.header, { color: c.text }]}>Exercise Library</Text>

      <Text style={[styles.filterLabel, { color: c.muted }]}>Difficulty</Text>
      <View style={styles.filterRow}>
        {(['all', ...DIFFICULTIES] as const).map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.chip,
              { borderColor: c.border, backgroundColor: diffFilter === d ? c.accent : c.card },
            ]}
            onPress={() => setDiffFilter(d)}
          >
            <Text style={{ color: diffFilter === d ? '#fff' : c.text, fontSize: 13 }}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.filterLabel, { color: c.muted }]}>Muscle Group</Text>
      <FlatList
        horizontal
        data={MUSCLE_GROUPS}
        keyExtractor={(g) => g}
        showsHorizontalScrollIndicator={false}
        style={styles.muscleRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              { borderColor: c.border, backgroundColor: muscleFilter === item ? c.accent : c.card },
            ]}
            onPress={() => setMuscleFilter(item)}
          >
            <Text style={{ color: muscleFilter === item ? '#fff' : c.text, fontSize: 13 }}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      />

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
            <View
              style={[
                styles.badge,
                { backgroundColor: DIFFICULTY_COLOR[item.difficulty] + '22' },
              ]}
            >
              <Text style={{ color: DIFFICULTY_COLOR[item.difficulty], fontSize: 12, fontWeight: '600' }}>
                {item.difficulty}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: '700', margin: 20, marginBottom: 8 },
  filterLabel: { fontSize: 12, fontWeight: '600', marginLeft: 16, marginTop: 8, textTransform: 'uppercase' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 4 },
  muscleRow: { paddingHorizontal: 12, marginBottom: 8 },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  cardLeft: { flex: 1 },
  name: { fontSize: 16, fontWeight: '500' },
  sub: { fontSize: 13, marginTop: 2 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
});
