"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Dumbbell, Flame, Clock, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MOCK_WORKOUTS = [
  {
    id: 1,
    name: "Back Squat",
    category: "Legs",
    sets: 4,
    reps: 5,
    weight: 120,
    duration: 18,
    calories: 142,
  },
  {
    id: 2,
    name: "Romanian Deadlift",
    category: "Posterior Chain",
    sets: 3,
    reps: 8,
    weight: 90,
    duration: 14,
    calories: 98,
  },
  {
    id: 3,
    name: "Leg Press",
    category: "Legs",
    sets: 3,
    reps: 12,
    weight: 200,
    duration: 12,
    calories: 84,
  },
];

const categoryColors: Record<string, string> = {
  Legs: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Posterior Chain": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Push: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Pull: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  const totalVolume = MOCK_WORKOUTS.reduce(
    (sum, w) => sum + w.sets * w.reps * w.weight,
    0
  );
  const totalCalories = MOCK_WORKOUTS.reduce((sum, w) => sum + w.calories, 0);
  const totalDuration = MOCK_WORKOUTS.reduce((sum, w) => sum + w.duration, 0);

  return (
    <div className="flex min-h-[calc(100vh-57px)] bg-muted/30">
      {/* Left — Calendar panel */}
      <aside className="w-80 shrink-0 border-r bg-background p-6 flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Training Log
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <Separator />

        <div className="flex flex-col items-center gap-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            className="rounded-xl border shadow-sm w-full"
          />

          <div className="w-full rounded-xl border bg-muted/50 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Selected date
            </p>
            <p className="text-lg font-semibold">{format(date, "do MMM yyyy")}</p>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">
                {MOCK_WORKOUTS.length} exercises logged
              </span>
            </div>
          </div>
        </div>

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
              <span className="text-sm font-semibold">{totalVolume.toLocaleString()} kg</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flame className="h-3.5 w-3.5" />
                Calories
              </div>
              <span className="text-sm font-semibold">{totalCalories} kcal</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Duration
              </div>
              <span className="text-sm font-semibold">{totalDuration} min</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right — Workout cards */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {format(date, "do MMM yyyy")}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {MOCK_WORKOUTS.length} exercises · {totalDuration} min
              </p>
            </div>
            <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
              Leg Day
            </Badge>
          </div>

          <Separator />

          {MOCK_WORKOUTS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <Dumbbell className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">No workouts logged for this date.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {MOCK_WORKOUTS.map((workout, i) => (
                <Card
                  key={workout.id}
                  className="group hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <CardHeader className="pb-3 pt-5 px-5 flex flex-row items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {i + 1}
                        </span>
                        <CardTitle className="text-base font-semibold">
                          {workout.name}
                        </CardTitle>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          categoryColors[workout.category] ??
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        {workout.category}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 mt-1 group-hover:text-muted-foreground transition-colors" />
                  </CardHeader>

                  <CardContent className="px-5 pb-5">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
                        <span className="text-muted-foreground">Sets</span>
                        <span className="font-bold">{workout.sets}</span>
                      </Badge>
                      <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
                        <span className="text-muted-foreground">Reps</span>
                        <span className="font-bold">{workout.reps}</span>
                      </Badge>
                      <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-bold">{workout.weight} kg</span>
                      </Badge>
                      <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span className="font-bold">{workout.calories} kcal</span>
                      </Badge>
                      <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium">
                        <Clock className="h-3 w-3 text-sky-400" />
                        <span className="font-bold">{workout.duration} min</span>
                      </Badge>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Volume</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/60"
                          style={{
                            width: `${Math.min(100, (workout.sets * workout.reps * workout.weight / totalVolume) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium tabular-nums">
                        {(workout.sets * workout.reps * workout.weight).toLocaleString()} kg
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
