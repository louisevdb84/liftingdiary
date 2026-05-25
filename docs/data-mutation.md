# Data Mutation

## Rule: Mutations via /data Helpers

All database mutations must go through helper functions in the `src/data` directory. These helpers use Drizzle ORM exclusively.

- **Never** write raw SQL for mutations
- **Never** mutate the database outside of `src/data` helpers
- One helper file per domain (e.g. `data/workouts.ts`, `data/exercises.ts`)
- Read helpers and mutation helpers live in the same domain file

### Example helper

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(clerkUserId: string) {
  const [workout] = await db
    .insert(workouts)
    .values({ clerkUserId })
    .returning();
  return workout;
}

export async function deleteWorkout(id: number, clerkUserId: string) {
  await db
    .delete(workouts)
    .where(eq(workouts.id, id) && eq(workouts.clerkUserId, clerkUserId));
}
```

## Rule: Server Actions Only

All data mutations must be triggered via **Server Actions**. No exceptions.

- **Never** mutate data in Route Handlers (`app/api/*/route.ts`)
- **Never** call `/data` mutation helpers directly from Client Components
- **Never** use `fetch` / `axios` to hit mutation endpoints

## Rule: Colocated actions.ts Files

Server Actions must be defined in a file named `actions.ts` colocated with the route segment that uses them.

```
src/app/workouts/
  page.tsx
  actions.ts        ← server actions for this route
src/app/workouts/[id]/
  page.tsx
  actions.ts        ← server actions for this nested route
```

Every `actions.ts` file must begin with `"use server"`.

## Rule: Typed Params — No FormData

Server Action parameters must be explicitly typed. `FormData` is **never** an acceptable parameter type.

```ts
// GOOD — typed params
export async function createWorkout(params: CreateWorkoutParams) { ... }

// BAD — FormData is banned
export async function createWorkout(formData: FormData) { ... }
```

## Rule: Zod Validation on Every Server Action

Every Server Action must validate its arguments with [Zod](https://zod.dev/) before doing anything else. Never trust caller-supplied data.

```ts
import { z } from "zod";

const createWorkoutSchema = z.object({
  startedAt: z.string().datetime(),
});

export async function createWorkout(params: z.infer<typeof createWorkoutSchema>) {
  const parsed = createWorkoutSchema.parse(params);
  // use parsed.* from here on
}
```

Use `schema.parse()` (throws on invalid input) rather than `schema.safeParse()` unless you need to return a structured error to the caller.

## Rule: Users May Only Mutate Their Own Data

Every mutation helper that operates on user-scoped rows **must** scope the write to the authenticated user's ID. Obtain the user ID from the server session inside the Server Action — never accept it as a caller-supplied parameter.

```ts
// src/app/workouts/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const schema = z.object({
  startedAt: z.string().datetime(),
});

export async function createWorkoutAction(params: z.infer<typeof schema>) {
  const parsed = schema.parse(params);
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return createWorkout(userId, new Date(parsed.startedAt));
}
```

### Incorrect patterns (never do these)

```ts
// BAD: userId accepted from caller — can be spoofed
export async function deleteWorkoutAction(params: { id: number; userId: string }) { ... }

// BAD: no Zod validation
export async function createWorkoutAction(params: { startedAt: string }) {
  return createWorkout(params.startedAt); // params is unvalidated
}

// BAD: FormData param
export async function createWorkoutAction(formData: FormData) { ... }

// BAD: mutation outside actions.ts, directly in a component
async function handleClick() {
  "use server";
  await db.insert(workouts).values({ ... });
}
```

## Rule: No `redirect()` in Server Actions

Never call `redirect()` inside a Server Action. Redirects must be handled client-side after the Server Action resolves.

```ts
// BAD — redirect inside a server action
export async function createWorkoutAction(params: ...) {
  const workout = await createWorkout(...);
  redirect(`/dashboard/workout/${workout.id}`); // ❌
}

// GOOD — server action returns data, client handles navigation
export async function createWorkoutAction(params: ...) {
  return createWorkout(...); // ✅
}
```

```tsx
// GOOD — client component navigates after the action resolves
"use client";
import { useRouter } from "next/navigation";

export function NewWorkoutForm() {
  const router = useRouter();

  async function handleSubmit() {
    const workout = await createWorkoutAction({ ... });
    router.push(`/dashboard/workout/${workout.id}`);
  }
}
```

## Full Example

```
src/app/workouts/
  page.tsx
  actions.ts
src/data/
  workouts.ts
```

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(clerkUserId: string, startedAt: Date) {
  const [workout] = await db
    .insert(workouts)
    .values({ clerkUserId, startedAt })
    .returning();
  return workout;
}
```

```ts
// src/app/workouts/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  startedAt: z.string().datetime(),
});

export async function createWorkoutAction(
  params: z.infer<typeof createWorkoutSchema>
) {
  const parsed = createWorkoutSchema.parse(params);
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return createWorkout(userId, new Date(parsed.startedAt));
}
```

```tsx
// src/app/workouts/page.tsx  (or a Client Component child)
"use client";

import { createWorkoutAction } from "./actions";

export function StartWorkoutButton() {
  return (
    <button
      onClick={() => createWorkoutAction({ startedAt: new Date().toISOString() })}
    >
      Start workout
    </button>
  );
}
```
