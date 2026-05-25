import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export async function createWorkout(
  clerkUserId: string,
  startedAt: Date,
  name?: string
) {
  const [workout] = await db
    .insert(workouts)
    .values({ clerkUserId, startedAt, name: name ?? null })
    .returning();
  return workout;
}

export async function getWorkoutsForDate(clerkUserId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      startedAt: workouts.startedAt,
      finishedAt: workouts.finishedAt,
      workoutExerciseId: workoutExercises.id,
      exerciseId: exercises.id,
      name: exercises.name,
      muscleGroup: exercises.muscleGroup,
      setId: sets.id,
      reps: sets.reps,
      weightKg: sets.weightKg,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.clerkUserId, clerkUserId),
        gte(workouts.startedAt, start),
        lt(workouts.startedAt, end)
      )
    );

  // Group into workouts -> exercises -> sets
  const workoutMap = new Map<
    number,
    {
      id: number;
      startedAt: Date;
      finishedAt: Date | null;
      exercises: Map<
        number,
        {
          workoutExerciseId: number;
          name: string;
          muscleGroup: string | null;
          sets: { id: number; reps: number | null; weightKg: number | null }[];
        }
      >;
    }
  >();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        startedAt: row.startedAt,
        finishedAt: row.finishedAt,
        exercises: new Map(),
      });
    }
    const workout = workoutMap.get(row.workoutId)!;

    if (row.workoutExerciseId == null) continue;
    if (!workout.exercises.has(row.workoutExerciseId)) {
      workout.exercises.set(row.workoutExerciseId, {
        workoutExerciseId: row.workoutExerciseId,
        name: row.name!,
        muscleGroup: row.muscleGroup ?? null,
        sets: [],
      });
    }
    const ex = workout.exercises.get(row.workoutExerciseId)!;

    if (row.setId != null) {
      ex.sets.push({ id: row.setId, reps: row.reps, weightKg: row.weightKg });
    }
  }

  return Array.from(workoutMap.values()).map((w) => ({
    ...w,
    exercises: Array.from(w.exercises.values()),
  }));
}
