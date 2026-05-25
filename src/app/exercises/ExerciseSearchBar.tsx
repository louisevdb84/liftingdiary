"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  bodyParts: string[];
  currentQuery: string | null;
  currentBodyPart: string | null;
};

export function ExerciseSearchBar({ bodyParts, currentQuery, currentBodyPart }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function navigate(query: string, bodyPart: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    if (bodyPart && bodyPart !== "all") params.set("bodyPart", bodyPart);
    else params.delete("bodyPart");
    startTransition(() => router.push(`/exercises?${params.toString()}`));
  }

  return (
    <div className="flex gap-3">
      <Input
        placeholder="Search exercises…"
        defaultValue={currentQuery ?? ""}
        className="max-w-sm"
        onChange={(e) => navigate(e.target.value, currentBodyPart ?? "")}
      />
      <Select
        defaultValue={currentBodyPart || "all"}
        onValueChange={(val) => navigate(currentQuery ?? "", val ?? "")}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All body parts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All body parts</SelectItem>
          {bodyParts.map((bp) => (
            <SelectItem key={bp} value={bp}>
              {bp.charAt(0).toUpperCase() + bp.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
