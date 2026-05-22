import { db } from "../src/db";
import { workouts, workoutExercises, exercises, sets } from "../src/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export type SetData = {
  id: number;
  reps: number | null;
  weightKg: number | null;
};

export type WorkoutExerciseData = {
  workoutExerciseId: number;
  exerciseId: number;
  name: string;
  muscleGroup: string | null;
  sets: SetData[];
};

export type WorkoutData = {
  id: number;
  startedAt: Date;
  finishedAt: Date | null;
  exercises: WorkoutExerciseData[];
};

export async function getWorkoutsForDate(
  userId: string,
  date: Date
): Promise<WorkoutData[]> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      startedAt: workouts.startedAt,
      finishedAt: workouts.finishedAt,
      workoutExerciseId: workoutExercises.id,
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      muscleGroup: exercises.muscleGroup,
      setId: sets.id,
      reps: sets.reps,
      weightKg: sets.weightKg,
    })
    .from(workouts)
    .innerJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.clerkUserId, userId),
        gte(workouts.startedAt, dayStart),
        lt(workouts.startedAt, dayEnd)
      )
    );

  const workoutMap = new Map<number, WorkoutData>();
  const exerciseMap = new Map<number, WorkoutExerciseData>();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        startedAt: row.startedAt,
        finishedAt: row.finishedAt,
        exercises: [],
      });
    }

    const weKey = row.workoutExerciseId;
    if (!exerciseMap.has(weKey)) {
      const ex: WorkoutExerciseData = {
        workoutExerciseId: weKey,
        exerciseId: row.exerciseId,
        name: row.exerciseName,
        muscleGroup: row.muscleGroup,
        sets: [],
      };
      exerciseMap.set(weKey, ex);
      workoutMap.get(row.workoutId)!.exercises.push(ex);
    }

    if (row.setId !== null) {
      exerciseMap.get(weKey)!.sets.push({
        id: row.setId,
        reps: row.reps,
        weightKg: row.weightKg,
      });
    }
  }

  return Array.from(workoutMap.values());
}
