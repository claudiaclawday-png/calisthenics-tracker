"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useWorkoutStore } from "@/lib/workout-store"
import { CalendarCheck, Flame } from "lucide-react"

const WEEKLY_TARGET = 6

export default function WeeklyStats() {
  const [stats, setStats] = useState<{ thisWeek: number; streak: number } | null>(null)

  useEffect(() => {
    setStats(useWorkoutStore.getState().getWeekStats())
  }, [])

  if (!stats) return null

  const pct = Math.min(100, (stats.thisWeek / WEEKLY_TARGET) * 100)

  return (
    <Card className="shadow-md border-2 border-border animate-in fade-in slide-in-from-bottom-4 speed-500 fill-mode-both">
      <CardContent className="pt-5">
        <div className="grid grid-cols-2 gap-5">
          {/* Weekly progress */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                <CalendarCheck className="h-4 w-4 text-accent" />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Esta semana
              </p>
            </div>
            <p className="text-3xl font-extrabold tabular-nums leading-none text-foreground">
              {stats.thisWeek}
              <span className="text-sm text-muted-foreground">/{WEEKLY_TARGET} sesiones</span>
            </p>
            <Progress
              value={pct}
              aria-label={`Progreso semanal: ${stats.thisWeek} de ${WEEKLY_TARGET} sesiones`}
              className="h-2 bg-muted [&>div]:bg-accent"
            />
            <p className="text-[11px] text-muted-foreground">
              {stats.thisWeek >= WEEKLY_TARGET
                ? "¡Meta semanal cumplida!"
                : `meta: ${WEEKLY_TARGET}/semana`}
            </p>
          </div>

          {/* Streak */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                <Flame className="h-4 w-4 text-accent" />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Racha
              </p>
            </div>
            <p className="text-3xl font-extrabold tabular-nums leading-none text-foreground">
              {stats.streak}
              <span className="text-sm text-muted-foreground">
                {" "}
                {stats.streak === 1 ? "día" : "días"}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              {stats.streak > 0
                ? "días seguidos con entrenamiento"
                : "entrená hoy para empezar tu racha"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
