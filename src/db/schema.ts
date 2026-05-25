import { integer, pgTable, varchar, timestamp, real } from "drizzle-orm/pg-core";

export const exercises = pgTable("exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  muscleGroup: varchar({ length: 100 }),
  createdAt: timestamp().defaultNow().notNull(),
});

export const workouts = pgTable("workouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }),
  startedAt: timestamp().defaultNow().notNull(),
  finishedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutId: integer().notNull().references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer().notNull().references(() => exercises.id, { onDelete: "restrict" }),
  createdAt: timestamp().defaultNow().notNull(),
});

export const sets = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutExerciseId: integer().notNull().references(() => workoutExercises.id, { onDelete: "cascade" }),
  reps: integer(),
  weightKg: real(),
  createdAt: timestamp().defaultNow().notNull(),
});
