import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useColorScheme,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WorkoutTemplate } from '../types/workout';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useTimer } from '../hooks/useTimer';
import { saveSession } from '../storage/database';
import { colors } from '../theme';

const REST_PRESETS = [30, 60, 90, 120];

export default function ActiveWorkoutScreen() {
  const scheme = useColorScheme();
  const c = colors(scheme);
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const template: WorkoutTemplate = route.params.template;

  const { session, addSet, updateSet, removeSet, finalize } = useWorkoutSession(template);
  const { secondsLeft, isRunning, start, stop } = useTimer();

  const [timerVisible, setTimerVisible] = useState(false);
  const startTimeRef = useRef(Date.now());

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function handleFinish() {
    Alert.alert('Finish Workout', 'Save and end this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Finish',
        onPress: () => {
          const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const completed = finalize(duration);
          saveSession(completed);
          nav.navigate('Home');
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={[styles.topBar, { borderBottomColor: c.border }]}>
        <Text style={[styles.title, { color: c.text }]}>{template.name}</Text>
        <TouchableOpacity onPress={handleFinish}>
          <Text style={[styles.finishBtn, { color: c.accent }]}>Finish</Text>
        </TouchableOpacity>
      </View>

      {isRunning && (
        <TouchableOpacity
          style={[styles.timerBanner, { backgroundColor: c.accent }]}
          onPress={() => setTimerVisible(true)}
        >
          <Text style={styles.timerBannerText}>Rest: {formatTime(secondsLeft)}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={session.exercises}
        keyExtractor={(el) => el.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: exLog }) => (
          <View style={[styles.exerciseCard, { backgroundColor: c.card }]}>
            <Text style={[styles.exerciseName, { color: c.text }]}>{exLog.exercise.name}</Text>
            <Text style={[styles.exerciseSub, { color: c.muted }]}>
              {exLog.exercise.muscleGroup} · {exLog.exercise.difficulty}
            </Text>

            <View style={styles.setHeader}>
              <Text style={[styles.colLabel, { color: c.muted, flex: 0.5 }]}>SET</Text>
              <Text style={[styles.colLabel, { color: c.muted }]}>LBS</Text>
              <Text style={[styles.colLabel, { color: c.muted }]}>REPS</Text>
              <View style={{ width: 32 }} />
            </View>

            {exLog.sets.map((set) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={[styles.setNum, { color: c.muted }]}>{set.setNumber}</Text>
                <TextInput
                  style={[styles.setInput, { color: c.text, borderColor: c.border, backgroundColor: c.bg }]}
                  keyboardType="decimal-pad"
                  value={set.weight === 0 ? '' : String(set.weight)}
                  placeholder="0"
                  placeholderTextColor={c.muted}
                  onChangeText={(v) => updateSet(exLog.id, set.id, 'weight', parseFloat(v) || 0)}
                />
                <TextInput
                  style={[styles.setInput, { color: c.text, borderColor: c.border, backgroundColor: c.bg }]}
                  keyboardType="number-pad"
                  value={set.reps === 0 ? '' : String(set.reps)}
                  placeholder="0"
                  placeholderTextColor={c.muted}
                  onChangeText={(v) => updateSet(exLog.id, set.id, 'reps', parseInt(v) || 0)}
                />
                <TouchableOpacity onPress={() => removeSet(exLog.id, set.id)}>
                  <Text style={{ color: c.danger, fontSize: 16, paddingHorizontal: 8 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.addSetBtn, { borderColor: c.accent }]}
                onPress={() => addSet(exLog.id)}
              >
                <Text style={{ color: c.accent, fontWeight: '600' }}>+ Add Set</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.restBtn, { backgroundColor: isRunning ? c.success : c.accent }]}
                onPress={() => setTimerVisible(true)}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  {isRunning ? `Rest ${formatTime(secondsLeft)}` : 'Rest Timer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <RestTimerModal
        visible={timerVisible}
        isRunning={isRunning}
        secondsLeft={secondsLeft}
        onStart={start}
        onStop={stop}
        onClose={() => setTimerVisible(false)}
        c={c}
      />
    </View>
  );
}

function RestTimerModal({
  visible,
  isRunning,
  secondsLeft,
  onStart,
  onStop,
  onClose,
  c,
}: {
  visible: boolean;
  isRunning: boolean;
  secondsLeft: number;
  onStart: (s: number) => void;
  onStop: () => void;
  onClose: () => void;
  c: ReturnType<typeof colors>;
}) {
  const [custom, setCustom] = useState('');

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  const progress = secondsLeft;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.sheet, { backgroundColor: c.card }]}>
          <Text style={[modalStyles.title, { color: c.text }]}>Rest Timer</Text>

          {isRunning ? (
            <>
              <Text style={[modalStyles.countdown, { color: c.accent }]}>
                {formatTime(secondsLeft)}
              </Text>
              <TouchableOpacity
                style={[modalStyles.stopBtn, { backgroundColor: c.danger }]}
                onPress={() => { onStop(); onClose(); }}
              >
                <Text style={modalStyles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[modalStyles.label, { color: c.muted }]}>Quick Select</Text>
              <View style={modalStyles.presets}>
                {REST_PRESETS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[modalStyles.preset, { backgroundColor: c.accent }]}
                    onPress={() => { onStart(s); onClose(); }}
                  >
                    <Text style={modalStyles.presetText}>{s}s</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[modalStyles.label, { color: c.muted }]}>Custom (seconds)</Text>
              <View style={modalStyles.customRow}>
                <TextInput
                  style={[modalStyles.customInput, { color: c.text, borderColor: c.border, backgroundColor: c.bg }]}
                  keyboardType="number-pad"
                  placeholder="e.g. 150"
                  placeholderTextColor={c.muted}
                  value={custom}
                  onChangeText={setCustom}
                />
                <TouchableOpacity
                  style={[modalStyles.startBtn, { backgroundColor: c.accent }]}
                  onPress={() => {
                    const s = parseInt(custom);
                    if (s > 0) { onStart(s); onClose(); }
                  }}
                >
                  <Text style={modalStyles.btnText}>Start</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <Text style={{ color: c.muted }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 56,
    borderBottomWidth: 1,
  },
  title: { fontSize: 20, fontWeight: '700' },
  finishBtn: { fontSize: 16, fontWeight: '600' },
  timerBanner: {
    padding: 12,
    alignItems: 'center',
  },
  timerBannerText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  list: { padding: 16, paddingBottom: 40 },
  exerciseCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
  exerciseName: { fontSize: 18, fontWeight: '600' },
  exerciseSub: { fontSize: 13, marginTop: 2, marginBottom: 12 },
  setHeader: { flexDirection: 'row', marginBottom: 4 },
  colLabel: { flex: 1, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  setNum: { flex: 0.5, fontSize: 14, textAlign: 'center' },
  setInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  cardActions: { flexDirection: 'row', marginTop: 12, gap: 10 },
  addSetBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  restBtn: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  countdown: { fontSize: 72, fontWeight: '700', textAlign: 'center', marginVertical: 16 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
  presets: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  preset: { flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 10, alignItems: 'center' },
  presetText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  customRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  startBtn: {
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopBtn: { borderRadius: 10, padding: 14, alignItems: 'center', marginVertical: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  closeBtn: { alignItems: 'center', marginTop: 8 },
});
