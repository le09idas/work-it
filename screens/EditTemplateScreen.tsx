import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useColorScheme,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EXERCISES } from '../data/exercises';
import { Exercise, MuscleGroup } from '../types/workout';
import { saveTemplate } from '../storage/database';
import { colors } from '../theme';

const MUSCLE_GROUPS: (MuscleGroup | 'all')[] = [
  'all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'core',
];

export default function EditTemplateScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const nav = useNavigation<any>();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | 'all'>('all');

  const filtered = EXERCISES.filter(
    (e) => muscleFilter === 'all' || e.muscleGroup === muscleFilter
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function save() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give your template a name.');
      return;
    }
    if (selected.length === 0) {
      Alert.alert('No exercises', 'Add at least one exercise.');
      return;
    }
    saveTemplate(name.trim(), selected);
    nav.goBack();
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <TextInput
        style={[styles.nameInput, { backgroundColor: c.card, color: c.text, borderColor: c.border }]}
        placeholder="Template name (e.g. Push Day)"
        placeholderTextColor={c.muted}
        value={name}
        onChangeText={setName}
      />

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

      <Text style={[styles.selectedCount, { color: c.muted }]}>
        {selected.length} exercise{selected.length !== 1 ? 's' : ''} selected
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? c.accent + '22' : c.card,
                  borderColor: isSelected ? c.accent : 'transparent',
                  borderWidth: 1.5,
                },
              ]}
              onPress={() => toggle(item.id)}
            >
              <View style={styles.cardLeft}>
                <Text style={[styles.name, { color: c.text }]}>{item.name}</Text>
                <Text style={[styles.sub, { color: c.muted }]}>
                  {item.muscleGroup} · {item.equipment} · {item.difficulty}
                </Text>
              </View>
              {isSelected && <Text style={{ color: c.accent, fontSize: 20 }}>✓</Text>}
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: c.accent }]}
        onPress={save}
      >
        <Text style={styles.saveBtnText}>Save Template</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nameInput: {
    margin: 16,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  muscleRow: { paddingHorizontal: 12, marginBottom: 4 },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedCount: { marginLeft: 16, marginBottom: 8, fontSize: 13 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
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
  saveBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
