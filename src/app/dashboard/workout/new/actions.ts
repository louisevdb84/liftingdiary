"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  startedAt: z.string().datetime(),
  name: z.string().max(255).optional(),
});

export async function createWorkoutAction(
  params: z.infer<typeof createWorkoutSchema>
) {
  const parsed = createWorkoutSchema.parse(params);
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return createWorkout(userId, new Date(parsed.startedAt), parsed.name);
}
