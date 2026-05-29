"use client"

import { useEffect, useState } from "react"
import { useWorkoutStore } from "@/lib/workout-store"
import { formatDate } from "@/lib/utils"
import { Trophy } from "lucide-react"


export default function RecentWorkouts() {
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([])
  const { getRecentWorkouts } = useWorkoutStore()

  useEffect(() => {
    setRecentWorkouts(getRecentWorkouts(3))
  }, [getRecentWorkouts])

  if (recentWorkouts.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-center rounded-2xl bg-muted/30 ring-1 ring-border">
        <div className="space-y-2">
          <Trophy className="mx-auto h-6 w-6 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">Sin entrenamientos registrados</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {recentWorkouts.map((workout, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-2xl border-2 bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="space-y-1">
            <p className="font-bold text-sm">{workout.exercise}</p>
            <p className="text-xs text-muted-foreground">{workout.workoutType}</p>
            <p className="text-[11px] text-muted-foreground/70">{formatDate(workout.date)}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-2xl font-extrabold tabular-nums text-primary">{workout.totalReps}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">reps</p>
            <p className="text-[11px] text-muted-foreground">
              {workout.workoutType === "Max Reps" && `Max: ${workout.maxReps}`}
              {workout.workoutType === "Sub Max" && `${workout.sets} series`}
              {workout.workoutType === "Volumen Escalera" && `${workout.cycles} ciclos`}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
