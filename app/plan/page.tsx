"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWorkoutStore } from "@/lib/workout-store"
import { ArrowLeft, Sparkles, CalendarDays, ChevronRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Complement {
  focus: string
  tagline: string
  exercises: string[]
}

interface WorkoutDay {
  dayName: string
  workoutType: string
  exercise: string
}

interface PlanSession {
  index: number
  dayName: string
  workoutType: string
  exercise: string
  complement: Complement
}

interface PlannedSession {
  session: PlanSession
  date: Date
  isToday: boolean
}

interface PlanWeek {
  label: string
  sessions: PlannedSession[]
}

type Cadence = "lmv" | "all"

const PLAN_SIZE = 12
// Mon(1) · Wed(3) · Fri(5), matching the daily reminder cadence
const LMV_WEEKDAYS = [1, 3, 5]
const DAY_MS = 24 * 60 * 60 * 1000

const toDayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

const startOfWeek = (d: Date) => {
  const monday = new Date(d)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return monday
}

// Pure projection: maps rotation order onto calendar dates for the chosen cadence
function projectDates(plan: PlanSession[], cadence: Cadence, today: Date): Date[] {
  const cursor = new Date(today)
  cursor.setHours(0, 0, 0, 0)
  const dates: Date[] = []

  for (let i = 0; i < plan.length; i++) {
    if (cadence === "all") {
      dates.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    } else {
      while (!LMV_WEEKDAYS.includes(cursor.getDay())) {
        cursor.setDate(cursor.getDate() + 1)
      }
      dates.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  return dates
}

const weekdayFmt = new Intl.DateTimeFormat("es-AR", { weekday: "long" })
const dayMonthFmt = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" })

function weekLabel(weekStart: Date, currentWeekStart: Date): string {
  const diff = Math.round((weekStart.getTime() - currentWeekStart.getTime()) / (7 * DAY_MS))
  if (diff === 0) return "Esta semana"
  if (diff === 1) return "Próxima semana"
  const fmt = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" })
  return `Semana del ${fmt.format(weekStart)}`
}

export default function PlanPage() {
  const [currentDay, setCurrentDay] = useState<WorkoutDay | null>(null)
  const [plan, setPlan] = useState<PlanSession[]>([])
  const [cadence, setCadence] = useState<Cadence>("lmv")
  const [today] = useState(() => new Date())

  useEffect(() => {
    const store = useWorkoutStore.getState()
    setCurrentDay(store.getCurrentWorkoutDay())
    setPlan(store.getUpcomingPlan(PLAN_SIZE))
  }, [])

  if (!currentDay) {
    return (
      <div className="container flex h-[60vh] items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  const workoutTypeDetails = useWorkoutStore.getState().getWorkoutTypeDetails
  const todayKey = toDayKey(today)
  const currentWeekStart = startOfWeek(today)

  // Muscle-balance summary: count each complement focus across the plan window
  const focusCounts = plan.reduce<Record<string, number>>((acc, session) => {
    acc[session.complement.focus] = (acc[session.complement.focus] || 0) + 1
    return acc
  }, {})
  const focusOrder = ["Piernas", "Core", "Horizontal"]

  // Project rotation order onto calendar dates, then group into calendar weeks
  const dates = projectDates(plan, cadence, today)
  const planned: PlannedSession[] = plan.map((session, i) => ({
    session,
    date: dates[i],
    isToday: toDayKey(dates[i]) === todayKey,
  }))
  const weeks: PlanWeek[] = []
  for (const item of planned) {
    const weekStart = startOfWeek(item.date)
    const label = weekLabel(weekStart, currentWeekStart)
    const last = weeks[weeks.length - 1]
    if (last && last.label === label) {
      last.sessions.push(item)
    } else {
      weeks.push({ label, sessions: [item] })
    }
  }

  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors active:scale-90">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Plan de Entrenamiento</h1>
        </div>
        <p className="text-muted-foreground text-sm font-semibold">
          Tu plan completo: entrenamiento principal + complemento, con fechas estimadas
        </p>
      </div>

      {/* Cadence toggle */}
      <div className="mb-4 space-y-2">
        <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">
          Cadencia estimada
        </p>
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted/50 p-1 ring-1 ring-border">
          <button
            type="button"
            onClick={() => setCadence("lmv")}
            aria-pressed={cadence === "lmv"}
            className={cn(
              "min-h-11 rounded-xl px-3 text-sm font-extrabold transition-all duration-200 active:scale-[0.98]",
              cadence === "lmv"
                ? "bg-accent text-accent-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Lun · Mié · Vie
          </button>
          <button
            type="button"
            onClick={() => setCadence("all")}
            aria-pressed={cadence === "all"}
            className={cn(
              "min-h-11 rounded-xl px-3 text-sm font-extrabold transition-all duration-200 active:scale-[0.98]",
              cadence === "all"
                ? "bg-accent text-accent-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Todos los días
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Proyección aproximada según la cadencia que elijas (3×/semana o 6-7×/semana).
        </p>
      </div>

      {/* Muscle-balance summary (secondary) */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
          Complementos en {PLAN_SIZE} sesiones:
        </span>
        {focusOrder.map((focus) => (
          <Badge
            key={focus}
            variant="outline"
            className="rounded-xl border-2 border-border bg-card px-3 py-1 text-xs font-extrabold text-foreground"
          >
            {focus} ×{focusCounts[focus] || 0}
          </Badge>
        ))}
      </div>

      {/* Upcoming sessions grouped by calendar week */}
      <div className="space-y-7">
        {weeks.map((week, weekIdx) => (
          <div
            key={week.label}
            className="space-y-3 animate-in fade-in slide-in-from-bottom-2 speed-500 fill-mode-both"
            style={{ animationDelay: `${weekIdx * 70}ms` }}
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">
                {week.label}
              </span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-bold text-muted-foreground">
                {week.sessions.length} {week.sessions.length === 1 ? "sesión" : "sesiones"}
              </span>
            </div>

            <div className="space-y-4">
              {week.sessions.map(({ session, date, isToday }, i) => {
                const isNext = session.index === 1
                const details = workoutTypeDetails(session.workoutType)
                return (
                  <Card
                    key={session.index}
                    className={cn(
                      "shadow-md border-2 transition-shadow animate-in fade-in slide-in-from-bottom-2 speed-500 fill-mode-both",
                      isNext ? "border-accent bg-accent/5 ring-1 ring-accent/20" : "border-border",
                    )}
                    style={{ animationDelay: `${weekIdx * 70 + (i + 1) * 50}ms` }}
                  >
                    <CardContent className="space-y-4 py-5">
                      {/* Top row: index + projected date + badges */}
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                            isNext ? "bg-accent text-accent-foreground shadow-sm" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {session.index}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold capitalize leading-tight text-foreground">
                            {weekdayFmt.format(date)} · {dayMonthFmt.format(date)}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Sesión {session.index} de {PLAN_SIZE}
                          </p>
                        </div>
                        {isToday && (
                          <Badge className="shrink-0 border-0 bg-accent px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-accent-foreground animate-in zoom-in-95 speed-300">
                            Hoy
                          </Badge>
                        )}
                        {isNext && (
                          <Badge className="shrink-0 gap-1 border-0 bg-accent px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-accent-foreground">
                            <Sparkles className="h-3 w-3" />
                            Siguiente
                          </Badge>
                        )}
                      </div>

                      {/* Main workout block (prominent) */}
                      <div
                        className={cn(
                          "rounded-2xl border-2 bg-card p-4",
                          isNext ? "border-accent/40" : "border-border",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <p className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                              {session.exercise}
                            </p>
                            <p className="text-xs font-bold text-muted-foreground">
                              {session.dayName} · Entrenamiento principal
                            </p>
                          </div>
                          <Badge className="shrink-0 border-0 bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground shadow-sm">
                            {details.label}
                          </Badge>
                        </div>
                        {details.prescription && (
                          <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted/50 px-3.5 py-2.5 ring-1 ring-border">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            <p className="text-sm font-semibold leading-snug text-foreground">
                              {details.prescription}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Complement block (secondary, muted) */}
                      <div className="rounded-2xl bg-muted/40 p-4 ring-1 ring-border">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                            Complemento · <span className="text-foreground">{session.complement.focus}</span>
                          </p>
                          {isNext && <ChevronRight className="h-4 w-4 shrink-0 text-accent" />}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{session.complement.tagline}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {session.complement.exercises.map((ex) => (
                            <span
                              key={ex}
                              className="rounded-lg bg-card px-2.5 py-1 text-xs font-bold text-foreground ring-1 ring-border"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Helper note */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        La rotación avanza a medida que completás cada entrenamiento.
      </p>
    </div>
  )
}
