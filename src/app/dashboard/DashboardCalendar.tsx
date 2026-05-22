"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";

interface DashboardCalendarProps {
  selectedDate: Date;
  exerciseCount: number;
}

export function DashboardCalendar({
  selectedDate,
  exerciseCount,
}: DashboardCalendarProps) {
  const router = useRouter();

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`);
  }

  return (
    <>
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
          selected={selectedDate}
          onSelect={handleSelect}
          locale={nl}
          className="rounded-xl border shadow-sm w-full"
        />

        <div className="w-full rounded-xl border bg-muted/50 p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Selected date
          </p>
          <p className="text-lg font-semibold">
            {format(selectedDate, "do MMM yyyy")}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">
              {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""} logged
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
