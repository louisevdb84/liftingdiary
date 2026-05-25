import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getExerciseById } from "../../../../data/exercises-api";
import { searchExerciseVideo } from "../../../../data/youtube-api";

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  expert: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { id } = await params;
  const exercise = await getExerciseById(id);
  const video = await searchExerciseVideo(exercise.name);

  return (
    <div className="min-h-[calc(100vh-57px)] bg-muted/30">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to library
        </Link>

        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Dumbbell className="h-6 w-6 text-muted-foreground" />
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight capitalize">
              {exercise.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="capitalize">{exercise.bodyPart}</Badge>
              <Badge variant="outline" className="capitalize">{exercise.target}</Badge>
              <Badge variant="outline" className="capitalize">{exercise.equipment}</Badge>
              {exercise.difficulty && (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    difficultyColors[exercise.difficulty] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {exercise.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {exercise.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {exercise.description}
          </p>
        )}

        {video ? (
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Video Demo</h2>
            <div className="relative w-full rounded-xl overflow-hidden bg-muted" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        ) : null}

        {exercise.secondaryMuscles.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Secondary Muscles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {exercise.secondaryMuscles.map((m) => (
                <Badge key={m} variant="outline" className="capitalize text-xs">
                  {m}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        <Separator />

        <div className="space-y-3">
          <h2 className="text-base font-semibold">Instructions</h2>
          <ol className="space-y-3">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
