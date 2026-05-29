"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkoutStore } from "@/lib/workout-store"
import { ArrowRight, Dumbbell, Zap, TrendingUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SelectWorkoutPage() {
  const router = useRouter()
  const { getCurrentWorkoutDay, getWorkoutSchedule } = useWorkoutStore()
  const [selectedExercise, setSelectedExercise] = useState<string>("")
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>("")
  const [suggestedWorkout, setSuggestedWorkout] = useState<any>(null)

  useEffect(() => {
    const suggested = getCurrentWorkoutDay()
    setSuggestedWorkout(suggested)
    setSelectedExercise(suggested.exercise)
    setSelectedWorkoutType(suggested.workoutType)
  }, [getCurrentWorkoutDay])

  const handleStartWorkout = () => {
    useWorkoutStore.getState().setSelectedWorkout({
      exercise: selectedExercise,
      workoutType: selectedWorkoutType,
    })
    router.push("/workout")
  }

  const workoutSchedule = getWorkoutSchedule()
  const exercises = Array.from(new Set(workoutSchedule.map((day) => day.exercise))).filter(
    (exercise) => exercise !== "Descanso",
  )
  const workoutTypes = Array.from(new Set(workoutSchedule.map((day) => day.workoutType))).filter(
    (type) => type !== "Descanso",
  )

  const workoutTypeConfig: Record<string, { icon: typeof Dumbbell; color: string; desc: string }> = {
    "Max Reps": { icon: Zap, color: "text-amber-500", desc: "3 series al máximo, 5 min descanso" },
    "Sub Max": { icon: TrendingUp, color: "text-emerald-500", desc: "10 series al 50%, 1 min descanso" },
    "Volumen Escalera": { icon: Dumbbell, color: "text-sky-500", desc: "Escalera 1→N, 5 ciclos, 30s descanso" },
  }

  return (
    <div className="container px-4 py-6 pb-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Seleccionar Entrenamiento</h1>
        <p className="text-muted-foreground">Elige ejercicio y tipo de sesión</p>
      </div>

      {suggestedWorkout && (
        <Card className="mb-8 border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold text-primary">Entrenamiento sugerido</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-bold">{suggestedWorkout.exercise}</p>
                <p className="text-sm text-muted-foreground">{suggestedWorkout.workoutType}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-background"
                onClick={() => {
                  setSelectedExercise(suggestedWorkout.exercise)
                  setSelectedWorkoutType(suggestedWorkout.workoutType)
                }}
              >
                Usar este
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {/* Exercise Selection */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ejercicio</h2>
          <div className="grid grid-cols-2 gap-3">
            {exercises.map((exercise) => (
              <button
                key={exercise}
                onClick={() => setSelectedExercise(exercise)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all",
                  selectedExercise === exercise
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50"
                )}
              >
                <span className="text-base font-bold">{exercise}</span>
                {selectedExercise === exercise && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Type Selection */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Tipo de entrenamiento</h2>
          <div className="space-y-3">
            {workoutTypes.map((type) => {
              const config = workoutTypeConfig[type] || { icon: Dumbbell, color: "text-gray-500", desc: "" }
              const Icon = config.icon
              const isSelected = selectedWorkoutType === type

              return (
                <button
                  key={type}
                  onClick={() => setSelectedWorkoutType(type)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50"
                  )}
                >
                  <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted", config.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base">{type}</p>
                    <p className="text-sm text-muted-foreground">{config.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold shadow-sm"
          onClick={handleStartWorkout}
          disabled={!selectedExercise || !selectedWorkoutType}
        >
          Comenzar Entrenamiento
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
