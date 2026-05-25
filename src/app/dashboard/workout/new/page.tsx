"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createWorkoutAction } from "./actions";

export default function NewWorkoutPage() {
  const router = useRouter();
  const now = new Date();
  const [date, setDate] = useState<Date>(now);
  const [time, setTime] = useState(
    now.toTimeString().slice(0, 5)
  );
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const [hours, minutes] = time.split(":").map(Number);
    const startedAt = new Date(date);
    startedAt.setHours(hours, minutes, 0, 0);
    await createWorkoutAction({
      startedAt: startedAt.toISOString(),
      name: name.trim() || undefined,
    });
    router.push(`/dashboard`);
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>New Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Upper Body, Leg Day…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger className="flex w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "do MMM yyyy")}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create Workout"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
