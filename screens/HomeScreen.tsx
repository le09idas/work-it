import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTemplates, deleteTemplate } from '../storage/database';
import { WorkoutTemplate } from '../types/workout';
import { colors } from '../theme';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const nav = useNavigation<any>();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      setTemplates(getTemplates());
    });
    return unsubscribe;
  }, [nav]);

  function handleDelete(id: string, name: string) {
    Alert.alert('Delete Template', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTemplate(id);
          setTemplates(getTemplates());
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.header, { color: c.text }]}>Your Workouts</Text>

      <FlatList
        data={templates}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: c.card }]}>
            <TouchableOpacity
              style={styles.cardMain}
              onPress={() => nav.navigate('ActiveWorkout', { template: item })}
            >
              <Text style={[styles.cardTitle, { color: c.text }]}>{item.name}</Text>
              <Text style={[styles.cardSub, { color: c.muted }]}>
                {item.exerciseIds.length} exercises
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
              <Text style={[styles.deleteBtn, { color: c.danger }]}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: c.muted }]}>No templates yet.</Text>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: c.accent }]}
        onPress={() => nav.navigate('EditTemplate', {})}
      >
        <Text style={styles.fabText}>+ New Template</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: '700', margin: 20, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardMain: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSub: { fontSize: 13, marginTop: 2 },
  deleteBtn: { fontSize: 18, paddingHorizontal: 8 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
