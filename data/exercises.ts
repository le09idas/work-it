import { Exercise } from '../types/workout';

export const EXERCISES: Exercise[] = [
  // CHEST
  { id: 'e1', name: 'Push-Up', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner' },
  { id: 'e2', name: 'Machine Chest Press', muscleGroup: 'chest', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e3', name: 'Dumbbell Chest Press', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'e4', name: 'Barbell Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e5', name: 'Incline Barbell Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e6', name: 'Incline Dumbbell Press', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'intermediate' },
  { id: 'e7', name: 'Cable Fly', muscleGroup: 'chest', equipment: 'cable', difficulty: 'intermediate' },
  { id: 'e8', name: 'Decline Barbell Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'advanced' },

  // BACK
  { id: 'e9', name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e10', name: 'Seated Cable Row', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner' },
  { id: 'e11', name: 'Assisted Pull-Up', muscleGroup: 'back', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e12', name: 'Pull-Up', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
  { id: 'e13', name: 'Barbell Row', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e14', name: 'Dumbbell Row', muscleGroup: 'back', equipment: 'dumbbell', difficulty: 'intermediate' },
  { id: 'e15', name: 'T-Bar Row', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced' },
  { id: 'e16', name: 'Weighted Pull-Up', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'advanced' },

  // SHOULDERS
  { id: 'e17', name: 'Dumbbell Lateral Raise', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'e18', name: 'Machine Shoulder Press', muscleGroup: 'shoulders', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e19', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate' },
  { id: 'e20', name: 'Barbell Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e21', name: 'Arnold Press', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate' },
  { id: 'e22', name: 'Barbell Push Press', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'advanced' },

  // BICEPS
  { id: 'e23', name: 'Dumbbell Curl', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner' },
  { id: 'e24', name: 'Machine Preacher Curl', muscleGroup: 'biceps', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e25', name: 'Barbell Curl', muscleGroup: 'biceps', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e26', name: 'Hammer Curl', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'intermediate' },
  { id: 'e27', name: 'Cable Curl', muscleGroup: 'biceps', equipment: 'cable', difficulty: 'intermediate' },

  // TRICEPS
  { id: 'e28', name: 'Tricep Pushdown', muscleGroup: 'triceps', equipment: 'cable', difficulty: 'beginner' },
  { id: 'e29', name: 'Machine Tricep Extension', muscleGroup: 'triceps', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e30', name: 'Skull Crushers', muscleGroup: 'triceps', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e31', name: 'Close Grip Bench Press', muscleGroup: 'triceps', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e32', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', equipment: 'dumbbell', difficulty: 'intermediate' },

  // LEGS
  { id: 'e33', name: 'Bodyweight Squat', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
  { id: 'e34', name: 'Leg Press', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e35', name: 'Leg Curl', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e36', name: 'Leg Extension', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { id: 'e37', name: 'Lunge', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
  { id: 'e38', name: 'Goblet Squat', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'intermediate' },
  { id: 'e39', name: 'Romanian Deadlift', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e40', name: 'Barbell Squat', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e41', name: 'Bulgarian Split Squat', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'intermediate' },
  { id: 'e42', name: 'Barbell Hip Thrust', muscleGroup: 'glutes', equipment: 'barbell', difficulty: 'intermediate' },
  { id: 'e43', name: 'Deadlift', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'advanced' },
  { id: 'e44', name: 'Front Squat', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'advanced' },
  { id: 'e45', name: 'Power Clean', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'advanced' },
  { id: 'e46', name: 'Single Leg Romanian Deadlift', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'advanced' },

  // CORE
  { id: 'e47', name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
  { id: 'e48', name: 'Crunch', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
  { id: 'e49', name: 'Mountain Climbers', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
  { id: 'e50', name: 'Hanging Leg Raise', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'intermediate' },
  { id: 'e51', name: 'Cable Crunch', muscleGroup: 'core', equipment: 'cable', difficulty: 'intermediate' },
  { id: 'e52', name: 'Ab Wheel Rollout', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'advanced' },
];

export const DEFAULT_TEMPLATES: { name: string; exerciseIds: string[] }[] = [
  {
    name: 'Push Day',
    exerciseIds: ['e4', 'e6', 'e20', 'e28', 'e17'],
  },
  {
    name: 'Pull Day',
    exerciseIds: ['e12', 'e13', 'e14', 'e25', 'e26'],
  },
  {
    name: 'Leg Day',
    exerciseIds: ['e40', 'e39', 'e34', 'e35', 'e36'],
  },
  {
    name: 'Upper Body',
    exerciseIds: ['e4', 'e13', 'e20', 'e9', 'e23'],
  },
  {
    name: 'Lower Body',
    exerciseIds: ['e40', 'e39', 'e34', 'e41', 'e35'],
  },
  {
    name: 'Full Body',
    exerciseIds: ['e40', 'e4', 'e13', 'e20', 'e43'],
  },
];
