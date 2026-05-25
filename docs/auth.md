# Authentication

## Provider: Clerk

This app uses **Clerk** (`@clerk/nextjs`) for all authentication. Do not implement custom auth, sessions, JWTs, or any other auth mechanism.

- Install version: `@clerk/nextjs` (see `package.json`)
- Never use NextAuth, Auth.js, Supabase Auth, or any other auth library

## Getting the Current User

### In Server Components and Server Actions

Use Clerk's `auth()` helper (server-only):

```ts
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  // use userId to scope data queries
}
```

### In Client Components

Use Clerk's `useAuth` or `useUser` hook:

```tsx
"use client";
import { useAuth } from "@clerk/nextjs";

export function MyClientComponent() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) return null;
  // render
}
```

Never pass `userId` from a client component to a server action as a parameter — always resolve it server-side via `auth()`.

## Route Protection

Use Clerk's middleware to protect routes. The middleware config lives in `middleware.ts` at the project root.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jinja2|ttf|woff2?|ico|gif|svg|png|jpg|jpeg|webp)).*)", "/(api|trpc)(.*)"],
};
```

- **Never** manually check for a session and redirect inside every page — use the middleware.
- Public routes (sign-in, sign-up, landing) must be explicitly listed in `isPublicRoute`.

## Sign-In and Sign-Up Pages

Use Clerk's pre-built components. Mount them at the conventional paths:

```
src/app/sign-in/[[...sign-in]]/page.tsx
src/app/sign-up/[[...sign-up]]/page.tsx
```

```tsx
// src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

Never build a custom sign-in form.

## User ID in Data Helpers

All `/data` helpers that fetch user-scoped data receive `userId` as a parameter. The caller (a Server Component) always retrieves `userId` from `auth()` — never from request params or client input.

```ts
// data/workouts.ts
export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const workouts = await getWorkoutsForUser(userId);
}
```

See also: [[data-fetching]] for the full data-access rules.

## Environment Variables

Clerk requires these environment variables (never commit their values):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
