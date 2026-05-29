"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useWorkoutStore } from "@/lib/workout-store"
import { ArrowRight, Dumbbell, Zap, TrendingUp, Sparkles, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SelectWorkoutPage() {
  const router = useRouter()
  const { getCurrentWorkoutDay, getWorkoutSchedule } = useWorkoutStore()
  const [selectedExercise, setSelectedExercise] = useState<string>("")
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>("")
  const [suggestedWorkout, setSuggestedWorkout] = useState<any>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const suggested = getCurrentWorkoutDay()
    setSuggestedWorkout(suggested)
    setSelectedExercise(suggested.exercise)
    setSelectedWorkoutType(suggested.workoutType)
  }, [getCurrentWorkoutDay])

  const handleStartWorkout = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      useWorkoutStore.getState().setSelectedWorkout({
        exercise: selectedExercise,
        workoutType: selectedWorkoutType,
      })
      router.push("/workout")
    }, 150)
  }

  const workoutSchedule = getWorkoutSchedule()
  const exercises = Array.from(new Set(workoutSchedule.map((day) => day.exercise))).filter(
    (exercise) => exercise !== "Descanso",
  )
  const workoutTypes = Array.from(new Set(workoutSchedule.map((day) => day.workoutType))).filter(
    (type) => type !== "Descanso",
  )

  const workoutTypeConfig: Record<string, { icon: typeof Dumbbell; color: string; bg: string; desc: string }> = {
    "Max Reps": { icon: Zap, color: "text-amber-600", bg: "bg-amber-50", desc: "3 series al máximo, 5 min descanso" },
    "Sub Max": { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", desc: "10 series al 50%, 1 min descanso" },
    "Volumen Escalera": { icon: Dumbbell, color: "text-sky-600", bg: "bg-sky-50", desc: "Escalera 1→N, 5 ciclos, 30s descanso" },
  }

  return (
    <div className="container px-4 py-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Seleccionar Entrenamiento</h1>
        <p className="text-muted-foreground text-base">Elige ejercicio y tipo de sesión</p>
      </div>

      {suggestedWorkout && (
        <div
          className={cn(
            "mb-8 rounded-2xl border-2 p-5 transition-all duration-200",
            "border-amber-200 bg-amber-50 shadow-sm"
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">Sugerido para hoy</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-bold text-lg text-foreground">{suggestedWorkout.exercise}</p>
              <p className="text-sm text-muted-foreground">{suggestedWorkout.workoutType}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-white border-amber-200 hover:bg-amber-100 hover:border-amber-300 font-semibold transition-all active:scale-95"
              onClick={() => {
                setSelectedExercise(suggestedWorkout.exercise)
                setSelectedWorkoutType(suggestedWorkout.workoutType)
              }}
            >
              Usar este
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {/* Exercise Selection */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ejercicio</h2>
          <div className="grid grid-cols-2 gap-3">
            {exercises.map((exercise) => {
              const isSelected = selectedExercise === exercise
              return (
                <button
                  key={exercise}
                  onClick={() => setSelectedExercise(exercise)}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-6 transition-all duration-200",
                    "active:scale-95 active:shadow-inner",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-md hover:bg-muted/50"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-sm">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
                    </div>
                  )}
                  <span className={cn(
                    "text-lg font-bold transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {exercise}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-semibold text-primary">Seleccionado</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Workout Type Selection */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tipo de entrenamiento</h2>
          <div className="space-y-3">
            {workoutTypes.map((type) => {
              const config = workoutTypeConfig[type] || { icon: Dumbbell, color: "text-gray-500", bg: "bg-gray-50", desc: "" }
              const Icon = config.icon
              const isSelected = selectedWorkoutType === type

              return (
                <button
                  key={type}
                  onClick={() => setSelectedWorkoutType(type)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                    "active:scale-[0.98] active:shadow-inner",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-md hover:bg-muted/50"
                  )}
                >
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", config.bg)}>
                    <Icon className={cn("h-6 w-6", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-bold text-base", isSelected ? "text-primary" : "text-foreground")}>{type}</p>
                    <p className="text-sm text-muted-foreground">{config.desc}</p>
                  </div>
                  {isSelected ? (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm">
                      <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="h-7 w-7 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <Button
          size="lg"
          className={cn(
            "w-full h-14 text-base font-bold shadow-lg transition-all duration-200",
            "active:scale-95 active:shadow-md",
            isTransitioning && "opacity-80 scale-95"
          )}
          onClick={handleStartWorkout}
          disabled={!selectedExercise || !selectedWorkoutType || isTransitioning}
        >
          {isTransitioning ? (
            <span className="animate-pulse">Preparando...</span>
          ) : (
            <>
              Comenzar Entrenamiento
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
