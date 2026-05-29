"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWorkoutStore } from "@/lib/workout-store"
import Link from "next/link"
import { Edit3, Calendar } from "lucide-react"


export default function WorkoutSchedule() {
  const [currentDay, setCurrentDay] = useState("")
  const [workoutType, setWorkoutType] = useState("")
  const [exercise, setExercise] = useState("")
  const { getCurrentWorkoutDay } = useWorkoutStore()

  useEffect(() => {
    const { dayName, workoutType, exercise } = getCurrentWorkoutDay()
    setCurrentDay(dayName)
    setWorkoutType(workoutType)
    setExercise(exercise)
  }, [getCurrentWorkoutDay])

  const isRestDay = exercise === "Descanso"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted ring-1 ring-border">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Día</p>
            <p className="text-lg font-extrabold leading-tight">{currentDay}</p>
          </div>
        </div>
        <Badge
          variant={isRestDay ? "secondary" : "default"}
          className="px-3 py-1.5 text-sm font-bold"
        >
          {exercise}
        </Badge>
      </div>

      {!isRestDay && (
        <div className="space-y-3 rounded-2xl bg-muted/50 p-5 ring-1 ring-border">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tipo</p>
            <p className="text-base font-bold">{workoutType}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {workoutType === "Max Reps" && "3 series al máximo con 5 minutos de descanso entre series."}
            {workoutType === "Sub Max" && "10 series al 50% del máximo con 1 minuto de descanso entre series."}
            {workoutType === "Volumen Escalera" &&
              "Escalera de repeticiones 1→Máximo. 5 ciclos con 30 segundos de descanso."}
          </p>
        </div>
      )}

      <Link href="/workout/select">
        <Button variant="outline" size="lg" className="w-full h-11 font-bold active:scale-95 transition-all duration-150">
          <Edit3 className="mr-2 h-4 w-4" />
          Cambiar Entrenamiento
        </Button>
      </Link>
    </div>
  )
}
