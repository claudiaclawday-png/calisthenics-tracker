"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWorkoutStore } from "@/lib/workout-store"
import { ArrowLeft, Sparkles, CalendarDays, ChevronRight } from "lucide-react"
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

const PLAN_SIZE = 12
const ROTATION_SIZE = 6

export default function PlanPage() {
  const [currentDay, setCurrentDay] = useState<WorkoutDay | null>(null)
  const [suggestedComplement, setSuggestedComplement] = useState<Complement | null>(null)
  const [plan, setPlan] = useState<PlanSession[]>([])

  useEffect(() => {
    const store = useWorkoutStore.getState()
    setCurrentDay(store.getCurrentWorkoutDay())
    setSuggestedComplement(store.getCurrentComplement())
    setPlan(store.getUpcomingPlan(PLAN_SIZE))
  }, [])

  if (!currentDay || !suggestedComplement) {
    return (
      <div className="container flex h-[60vh] items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Muscle-balance summary: count each focus across the plan window
  const focusCounts = plan.reduce<Record<string, number>>((acc, session) => {
    acc[session.complement.focus] = (acc[session.complement.focus] || 0) + 1
    return acc
  }, {})
  const focusOrder = ["Piernas", "Core", "Horizontal"]

  // Group sessions into full rotations of ROTATION_SIZE
  const rotations: PlanSession[][] = []
  for (let i = 0; i < plan.length; i += ROTATION_SIZE) {
    rotations.push(plan.slice(i, i + ROTATION_SIZE))
  }

  return (
    <div className="container px-4 py-6">
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors active:scale-90">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Plan de Entrenamiento</h1>
        </div>
        <p className="text-muted-foreground text-sm font-semibold">
          Próximas {PLAN_SIZE} sesiones de la rotación
        </p>
      </div>

      {/* Today highlight card */}
      <div className="mb-6 rounded-2xl border-2 border-accent/40 bg-card p-5 shadow-md ring-1 ring-accent/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="text-xs font-extrabold text-accent uppercase tracking-widest">Hoy</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="text-lg font-extrabold text-foreground leading-tight">
              {currentDay.dayName} · {currentDay.workoutType} · {currentDay.exercise}
            </p>
            <p className="text-sm text-muted-foreground">
              Complemento sugerido: <span className="font-bold text-foreground">{suggestedComplement.focus}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Muscle-balance summary */}
      <Card className="mb-6 shadow-md border-2 border-border">
        <CardContent className="pt-5">
          <p className="mb-3 text-xs font-extrabold text-muted-foreground uppercase tracking-widest">
            Balance en {PLAN_SIZE} sesiones
          </p>
          <div className="flex flex-wrap gap-2">
            {focusOrder.map((focus) => (
              <Badge
                key={focus}
                variant="outline"
                className="min-h-11 rounded-xl border-2 border-border bg-card px-4 text-sm font-extrabold text-foreground"
              >
                {focus} ×{focusCounts[focus] || 0}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming sessions grouped by rotation */}
      <div className="space-y-6">
        {rotations.map((sessions, rotationIdx) => (
          <div key={rotationIdx} className="space-y-3">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">
                Rotación {rotationIdx + 1}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-3">
              {sessions.map((session) => {
                const isNext = session.index === 1
                return (
                  <Card
                    key={session.index}
                    className={cn(
                      "shadow-md border-2 transition-shadow",
                      isNext ? "border-accent bg-accent/5 ring-1 ring-accent/20" : "border-border",
                    )}
                  >
                    <CardContent className="flex items-center gap-3 py-4">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                          isNext ? "bg-accent text-accent-foreground shadow-sm" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {session.index}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-sm leading-tight text-foreground">
                          {session.dayName} · {session.workoutType} · {session.exercise}
                        </p>
                        <div className="mt-1.5">
                          <Badge
                            className={cn(
                              "px-2.5 py-0.5 text-xs font-extrabold border-0",
                              isNext
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {session.complement.focus}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {session.complement.exercises.join(" · ")}
                          </p>
                        </div>
                      </div>
                      {isNext && <ChevronRight className="h-5 w-5 shrink-0 text-accent" />}
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
