import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { EXERCISES } from '../data/exercises';
import { getExerciseHistory } from '../storage/database';
import { colors } from '../theme';

export default function ProgressScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const nav = useNavigation<any>();
  const [exercisesWithData, setExercisesWithData] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const withData = EXERCISES.filter((e) => {
        const history = getExerciseHistory(e.id);
        return history.length > 0;
      }).map((e) => e.id);
      setExercisesWithData(withData);
    }, [])
  );

  const tracked = EXERCISES.filter((e) => exercisesWithData.includes(e.id));

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.header, { color: c.text }]}>Progress</Text>

      <FlatList
        data={tracked}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
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
          <Text style={[styles.empty, { color: c.muted }]}>
            Log some workouts to see your progress here.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: '700', margin: 20, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  name: { fontSize: 17, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
});
