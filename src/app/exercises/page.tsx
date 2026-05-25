import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Dumbbell, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import {
  getBodyPartList,
  getDefaultExercises,
  getExercisesByBodyPart,
  searchExercises,
} from "../../../data/exercises-api";
import { ExerciseSearchBar } from "./ExerciseSearchBar";

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  expert: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; bodyPart?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { q, bodyPart } = await searchParams;

  const [bodyParts, exercises] = await Promise.all([
    getBodyPartList(),
    q
      ? searchExercises(q)
      : bodyPart
      ? getExercisesByBodyPart(bodyPart)
      : getDefaultExercises(),
  ]);

  return (
    <div className="min-h-[calc(100vh-57px)] bg-muted/30">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exercise Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse {exercises.length} exercises — click any for full instructions
          </p>
        </div>

        <Suspense>
          <ExerciseSearchBar
            bodyParts={bodyParts}
            currentQuery={q ?? ""}
            currentBodyPart={bodyPart ?? ""}
          />
        </Suspense>

        {exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Dumbbell className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">No exercises found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((ex) => (
              <Link key={ex.id} href={`/exercises/${ex.id}`}>
                <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer h-full">
                  <CardHeader className="pb-2 pt-5 px-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <CardTitle className="text-sm font-semibold capitalize leading-snug">
                          {ex.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ex.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Video demo available
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {ex.bodyPart}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {ex.target}
                      </Badge>
                      {ex.difficulty && (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            difficultyColors[ex.difficulty] ?? "bg-muted text-muted-foreground"
                          }`}
                        >
                          {ex.difficulty}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
