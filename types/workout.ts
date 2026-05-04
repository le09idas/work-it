export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType = 'bodyweight' | 'barbell' | 'dumbbell' | 'machine' | 'cable';
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'glutes';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: EquipmentType;
  difficulty: Difficulty;
}

export interface SetLog {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: SetLog[];
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  templateName: string;
  date: string;
  durationSeconds: number;
  exercises: ExerciseLog[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exerciseIds: string[];
}
