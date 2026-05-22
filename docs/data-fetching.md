# Data Fetching

## Rule: Server Components Only

ALL data fetching must be done in **Server Components**. No exceptions.

- **Never** fetch data in Client Components (`"use client"`)
- **Never** fetch data in Route Handlers (`app/api/*/route.ts`)
- **Never** use `useEffect` + `fetch` or SWR/React Query to load data
- **Never** call database helpers from Client Components

If a Client Component needs data, fetch it in a Server Component parent and pass it down as props.

## Rule: Drizzle ORM via /data Helpers

All database queries must go through helper functions in the `/data` directory. These helpers use Drizzle ORM exclusively.

- **Never** write raw SQL (`db.execute(sql\`...\`)`or `drizzle.$client.query(...)`)
- **Never** query the database outside of `/data` helpers
- One helper file per domain (e.g. `data/workouts.ts`, `data/exercises.ts`)

### Example helper

```ts
// data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example Server Component consuming the helper

```tsx
// app/dashboard/page.tsx  (Server Component — no "use client")
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);
  return <WorkoutList workouts={workouts} />;
}
```

## Rule: Users May Only Access Their Own Data

Every `/data` helper that returns user-scoped data **must** filter by the authenticated user's ID. Never fetch all rows and filter in the UI.

- Obtain the user ID from the active session inside the Server Component, then pass it explicitly into the helper.
- The helper must include a `WHERE userId = :userId` clause (via Drizzle's `eq(table.userId, userId)`).
- Never accept an arbitrary `userId` from query params, route params, or request bodies without verifying it matches the authenticated user.

### Correct pattern

```ts
// data/workouts.ts
export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// app/dashboard/page.tsx
const session = await auth();
if (!session) redirect("/login");
const workouts = await getWorkoutsForUser(session.user.id); // ID comes from server session
```

### Incorrect patterns (never do these)

```ts
// BAD: no user filter — returns all users' data
export async function getAllWorkouts() {
  return db.select().from(workouts);
}

// BAD: trusts user-supplied ID from URL params
const workouts = await getWorkoutsForUser(params.userId);
```
