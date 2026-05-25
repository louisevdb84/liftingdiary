import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Dumbbell, Flame, Clock, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardCalendar } from "./DashboardCalendar";
import { getWorkoutsForDate } from "../../../data/workouts";

const muscleGroupColors: Record<string, string> = {
  Legs: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Posterior Chain":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Push: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Pull: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Back: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Chest: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Shoulders:
    "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  Arms: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Core: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date: dateParam } = await searchParams;
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const workoutList = await getWorkoutsForDate(userId, selectedDate);

  const allExercises = workoutList.flatMap((w) => w.exercises);

  const totalVolume = allExercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets.reduce(
        (s, set) => s + (set.reps ?? 0) * (set.weightKg ?? 0),
        0
      ),
    0
  );

  const totalDuration = workoutList.reduce((sum, w) => {
    if (!w.finishedAt) return sum;
    return sum + Math.round((w.finishedAt.getTime() - w.startedAt.getTime()) / 60000);
  }, 0);

  return (
    <div className="flex min-h-[calc(100vh-57px)] bg-muted/30">
      {/* Left — Calendar panel */}
      <aside className="w-80 shrink-0 border-r bg-background p-6 flex flex-col gap-6">
        <DashboardCalendar
          selectedDate={selectedDate}
          exerciseCount={allExercises.length}
        />

        {/* Summary stats */}
        <div className="mt-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Day summary
          </p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Dumbbell className="h-3.5 w-3.5" />
                Total volume
              </div>
              <span className="text-sm font-semibold">
                {totalVolume.toLocaleString()} kg
              </span>
            </div>
            {totalDuration > 0 && (
              <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Duration
                </div>
                <span className="text-sm font-semibold">
                  {totalDuration} min
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Right — Workout cards */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {format(selectedDate, "do MMM yyyy")}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {allExercises.length} exercise
                {allExercises.length !== 1 ? "s" : ""}
                {totalDuration > 0 ? ` · ${totalDuration} min` : ""}
              </p>
            </div>
            <Link
              href="/dashboard/workout/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              New Workout
            </Link>
          </div>

          <Separator />

          {allExercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <Dumbbell className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                No workouts logged for this date.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allExercises.map((ex, i) => {
                const volume = ex.sets.reduce(
                  (s, set) => s + (set.reps ?? 0) * (set.weightKg ?? 0),
                  0
                );
                return (
                  <Card
                    key={ex.workoutExerciseId}
                    className="group hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <CardHeader className="pb-3 pt-5 px-5 flex flex-row items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                            {i + 1}
                          </span>
                          <CardTitle className="text-base font-semibold">
                            {ex.name}
                          </CardTitle>
                        </div>
                        {ex.muscleGroup && (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              muscleGroupColors[ex.muscleGroup] ??
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            {ex.muscleGroup}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 mt-1 group-hover:text-muted-foreground transition-colors" />
                    </CardHeader>

                    <CardContent className="px-5 pb-5 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {ex.sets.map((set, si) => (
                          <Badge
                            key={set.id}
                            variant="secondary"
                            className="gap-1.5 px-3 py-1 text-xs font-medium"
                          >
                            <span className="text-muted-foreground">
                              Set {si + 1}
                            </span>
                            <span className="font-bold">
                              {set.reps ?? "—"} × {set.weightKg ?? "—"} kg
                            </span>
                          </Badge>
                        ))}
                      </div>

                      {totalVolume > 0 && volume > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Volume
                          </span>
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/60"
                              style={{
                                width: `${Math.min(100, (volume / totalVolume) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium tabular-nums">
                            {volume.toLocaleString()} kg
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
