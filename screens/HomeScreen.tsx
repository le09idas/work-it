import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useColorScheme,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getTemplates, deleteTemplate, duplicateTemplate } from '../storage/database';
import { WorkoutTemplate } from '../types/workout';
import { colors } from '../theme';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const nav = useNavigation<any>();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [menuTarget, setMenuTarget] = useState<WorkoutTemplate | null>(null);

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      setTemplates(getTemplates());
    });
    return unsubscribe;
  }, [nav]);

  function refresh() {
    setTemplates(getTemplates());
  }

  function handleStart() {
    if (!menuTarget) return;
    const t = menuTarget;
    setMenuTarget(null);
    nav.navigate('WorkoutPreview', { template: t });
  }

  function handleEdit() {
    if (!menuTarget) return;
    const t = menuTarget;
    setMenuTarget(null);
    nav.navigate('EditTemplate', { template: t });
  }

  function handleDuplicate() {
    if (!menuTarget) return;
    duplicateTemplate(menuTarget.id);
    setMenuTarget(null);
    refresh();
  }

  function handleDelete() {
    if (!menuTarget) return;
    const t = menuTarget;
    setMenuTarget(null);
    Alert.alert('Delete Template', `Remove "${t.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTemplate(t.id);
          refresh();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.header, { color: c.text }]}>Your Workouts</Text>

      <FlatList
        data={templates}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: c.card }]}>
            <TouchableOpacity
              style={styles.cardMain}
              onPress={() => nav.navigate('WorkoutPreview', { template: item })}
              onLongPress={() => setMenuTarget(item)}
              delayLongPress={400}
            >
              <Text style={[styles.cardTitle, { color: c.text }]}>{item.name}</Text>
              <Text style={[styles.cardSub, { color: c.muted }]}>
                {item.exerciseIds.length} exercises
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuTarget(item)} hitSlop={10}>
              <Text style={[styles.dots, { color: c.muted }]}>⋮</Text>
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

      <Modal visible={!!menuTarget} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setMenuTarget(null)}>
          <Pressable style={[styles.menu, { backgroundColor: c.card }]} onPress={() => {}}>
            <Text style={[styles.menuTitle, { color: c.muted }]}>{menuTarget?.name}</Text>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: c.border }]} onPress={handleStart}>
              <Text style={[styles.menuItemText, { color: c.text }]}>Start Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: c.border }]} onPress={handleEdit}>
              <Text style={[styles.menuItemText, { color: c.text }]}>Edit Template</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: c.border }]} onPress={handleDuplicate}>
              <Text style={[styles.menuItemText, { color: c.text }]}>Duplicate Template</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: 'transparent' }]} onPress={handleDelete}>
              <Text style={[styles.menuItemText, { color: c.danger }]}>Delete Template</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
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
  dots: { fontSize: 22, paddingHorizontal: 8, paddingVertical: 4 },
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 280,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemText: { fontSize: 17, textAlign: 'center' },
});
