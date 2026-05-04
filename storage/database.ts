import * as SQLite from 'expo-sqlite';
import { EXERCISES, DEFAULT_TEMPLATES } from '../data/exercises';
import { WorkoutSession, WorkoutTemplate, ExerciseLog, SetLog } from '../types/workout';

const db = SQLite.openDatabaseSync('workit.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      exerciseIds TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      templateId TEXT NOT NULL,
      templateName TEXT NOT NULL,
      date TEXT NOT NULL,
      durationSeconds INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS exercise_logs (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      exerciseId TEXT NOT NULL,
      FOREIGN KEY (sessionId) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS set_logs (
      id TEXT PRIMARY KEY,
      exerciseLogId TEXT NOT NULL,
      setNumber INTEGER NOT NULL,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      FOREIGN KEY (exerciseLogId) REFERENCES exercise_logs(id)
    );
  `);

  const count = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM templates');
  if (count?.count === 0) {
    seedTemplates();
  }
}

function seedTemplates() {
  for (const t of DEFAULT_TEMPLATES) {
    const id = `template_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    db.runSync(
      'INSERT INTO templates (id, name, exerciseIds) VALUES (?, ?, ?)',
      id,
      t.name,
      JSON.stringify(t.exerciseIds)
    );
  }
}

export function getTemplates(): WorkoutTemplate[] {
  const rows = db.getAllSync<{ id: string; name: string; exerciseIds: string }>(
    'SELECT * FROM templates ORDER BY name'
  );
  return rows.map((r) => ({ ...r, exerciseIds: JSON.parse(r.exerciseIds) }));
}

export function saveTemplate(name: string, exerciseIds: string[]): WorkoutTemplate {
  const id = `template_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  db.runSync(
    'INSERT INTO templates (id, name, exerciseIds) VALUES (?, ?, ?)',
    id,
    name,
    JSON.stringify(exerciseIds)
  );
  return { id, name, exerciseIds };
}

export function updateTemplate(id: string, name: string, exerciseIds: string[]) {
  db.runSync(
    'UPDATE templates SET name = ?, exerciseIds = ? WHERE id = ?',
    name,
    JSON.stringify(exerciseIds),
    id
  );
}

export function duplicateTemplate(id: string): WorkoutTemplate {
  const original = db.getFirstSync<{ name: string; exerciseIds: string }>(
    'SELECT name, exerciseIds FROM templates WHERE id = ?',
    id
  )!;
  const newId = `template_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const newName = `${original.name} (Copy)`;
  db.runSync(
    'INSERT INTO templates (id, name, exerciseIds) VALUES (?, ?, ?)',
    newId,
    newName,
    original.exerciseIds
  );
  return { id: newId, name: newName, exerciseIds: JSON.parse(original.exerciseIds) };
}

export function deleteTemplate(id: string) {
  db.runSync('DELETE FROM templates WHERE id = ?', id);
}

export function saveSession(session: WorkoutSession) {
  db.runSync(
    'INSERT INTO sessions (id, templateId, templateName, date, durationSeconds) VALUES (?, ?, ?, ?, ?)',
    session.id,
    session.templateId,
    session.templateName,
    session.date,
    session.durationSeconds
  );

  for (const exLog of session.exercises) {
    db.runSync(
      'INSERT INTO exercise_logs (id, sessionId, exerciseId) VALUES (?, ?, ?)',
      exLog.id,
      session.id,
      exLog.exerciseId
    );
    for (const s of exLog.sets) {
      db.runSync(
        'INSERT INTO set_logs (id, exerciseLogId, setNumber, weight, reps) VALUES (?, ?, ?, ?, ?)',
        s.id,
        exLog.id,
        s.setNumber,
        s.weight,
        s.reps
      );
    }
  }
}

export function getSessions(): WorkoutSession[] {
  const sessions = db.getAllSync<{
    id: string;
    templateId: string;
    templateName: string;
    date: string;
    durationSeconds: number;
  }>('SELECT * FROM sessions ORDER BY date DESC');

  return sessions.map((s) => {
    const exLogs = db.getAllSync<{ id: string; exerciseId: string }>(
      'SELECT * FROM exercise_logs WHERE sessionId = ?',
      s.id
    );

    const exercises: ExerciseLog[] = exLogs.map((el) => {
      const sets = db.getAllSync<{ id: string; setNumber: number; weight: number; reps: number }>(
        'SELECT * FROM set_logs WHERE exerciseLogId = ? ORDER BY setNumber',
        el.id
      );
      const exercise = EXERCISES.find((e) => e.id === el.exerciseId)!;
      return {
        id: el.id,
        exerciseId: el.exerciseId,
        exercise,
        sets: sets as SetLog[],
      };
    });

    return { ...s, exercises };
  });
}

export function getExerciseHistory(exerciseId: string) {
  const rows = db.getAllSync<{
    date: string;
    weight: number;
    reps: number;
    setNumber: number;
  }>(
    `SELECT s.date, sl.weight, sl.reps, sl.setNumber
     FROM set_logs sl
     JOIN exercise_logs el ON sl.exerciseLogId = el.id
     JOIN sessions s ON el.sessionId = s.id
     WHERE el.exerciseId = ?
     ORDER BY s.date ASC, sl.setNumber ASC`,
    exerciseId
  );
  return rows;
}
