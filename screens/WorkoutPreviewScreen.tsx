import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WorkoutTemplate } from '../types/workout';
import { EXERCISES } from '../data/exercises';
import { colors } from '../theme';

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: '#34C759',
  intermediate: '#FF9F0A',
  advanced: '#FF453A',
};

export default function WorkoutPreviewScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const template: WorkoutTemplate = route.params.template;

  const exercises = template.exerciseIds
    .map((id) => EXERCISES.find((e) => e.id === id))
    .filter(Boolean) as typeof EXERCISES;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.title, { color: c.text }]}>{template.name}</Text>
      <Text style={[styles.subtitle, { color: c.muted }]}>
        {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={exercises}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={[styles.row, { backgroundColor: c.card }]}>
            <Text style={[styles.index, { color: c.muted }]}>{index + 1}</Text>
            <View style={styles.info}>
              <Text style={[styles.name, { color: c.text }]}>{item.name}</Text>
              <Text style={[styles.sub, { color: c.muted }]}>
                {item.muscleGroup} · {item.equipment}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: DIFFICULTY_COLOR[item.difficulty] + '22' }]}>
              <Text style={{ color: DIFFICULTY_COLOR[item.difficulty], fontSize: 11, fontWeight: '600' }}>
                {item.difficulty}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { borderTopColor: c.border }]}>
        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: c.accent }]}
          onPress={() => nav.replace('ActiveWorkout', { template })}
        >
          <Text style={styles.startBtnText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 26, fontWeight: '700', marginTop: 16, marginHorizontal: 20, marginBottom: 4 },
  subtitle: { fontSize: 14, marginHorizontal: 20, marginBottom: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 120 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  index: { fontSize: 15, fontWeight: '600', width: 28 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '500' },
  sub: { fontSize: 12, marginTop: 2 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  startBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
