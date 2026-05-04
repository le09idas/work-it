import { useState, useCallback } from 'react';
import { WorkoutSession, ExerciseLog, SetLog, WorkoutTemplate } from '../types/workout';
import { EXERCISES } from '../data/exercises';

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function useWorkoutSession(template: WorkoutTemplate) {
  const [session, setSession] = useState<WorkoutSession>(() => ({
    id: uid(),
    templateId: template.id,
    templateName: template.name,
    date: new Date().toISOString(),
    durationSeconds: 0,
    exercises: template.exerciseIds.map((eid) => ({
      id: uid(),
      exerciseId: eid,
      exercise: EXERCISES.find((e) => e.id === eid)!,
      sets: [],
    })),
  }));

  const addSet = useCallback((exerciseLogId: string) => {
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((el) => {
        if (el.id !== exerciseLogId) return el;
        const setNumber = el.sets.length + 1;
        const lastSet = el.sets[el.sets.length - 1];
        const newSet: SetLog = {
          id: uid(),
          setNumber,
          weight: lastSet?.weight ?? 0,
          reps: lastSet?.reps ?? 10,
        };
        return { ...el, sets: [...el.sets, newSet] };
      }),
    }));
  }, []);

  const updateSet = useCallback(
    (exerciseLogId: string, setId: string, field: 'weight' | 'reps', value: number) => {
      setSession((prev) => ({
        ...prev,
        exercises: prev.exercises.map((el) => {
          if (el.id !== exerciseLogId) return el;
          return {
            ...el,
            sets: el.sets.map((s) =>
              s.id === setId ? { ...s, [field]: value } : s
            ),
          };
        }),
      }));
    },
    []
  );

  const removeSet = useCallback((exerciseLogId: string, setId: string) => {
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((el) => {
        if (el.id !== exerciseLogId) return el;
        const filtered = el.sets.filter((s) => s.id !== setId);
        return {
          ...el,
          sets: filtered.map((s, i) => ({ ...s, setNumber: i + 1 })),
        };
      }),
    }));
  }, []);

  const finalize = useCallback((durationSeconds: number): WorkoutSession => {
    const finalized = { ...session, durationSeconds };
    setSession(finalized);
    return finalized;
  }, [session]);

  return { session, addSet, updateSet, removeSet, finalize };
}
