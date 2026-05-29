"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWorkoutStore } from "@/lib/workout-store"
import { formatDate } from "@/lib/utils"
import { Calendar, Trophy, Dumbbell, TrendingUp } from "lucide-react"
import HistoryActions from "@/components/history-actions"

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const { getAllWorkouts } = useWorkoutStore()

  useEffect(() => {
    setWorkouts(getAllWorkouts())
  }, [getAllWorkouts])

  const groupByDate = (workouts: any[]) => {
    const grouped: Record<string, any[]> = {}

    workouts.forEach((workout) => {
      const date = formatDate(workout.date)
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(workout)
    })

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, workouts]) => ({ date, workouts }))
  }

  const groupByExercise = (workouts: any[]) => {
    const pullUps = workouts.filter((w) => w.exercise === "Dominadas")
    const dips = workouts.filter((w) => w.exercise === "Fondos")

    return [
      { name: "Dominadas", workouts: pullUps },
      { name: "Fondos", workouts: dips },
    ]
  }

  const dateGroups = groupByDate(workouts)
  const exerciseGroups = groupByExercise(workouts)

  if (workouts.length === 0) {
    return (
      <div className="container flex h-[60vh] items-center justify-center px-4 py-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20">
            <Trophy className="h-8 w-8 text-accent" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Sin entrenamientos</h2>
            <p className="text-muted-foreground text-sm">Completa tu primer entrenamiento para ver tu historial</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6">
      <div className="mb-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Historial</h1>
            <p className="text-muted-foreground text-sm">Tu progreso y entrenamientos anteriores</p>
          </div>
          <HistoryActions />
        </div>
      </div>

      <Tabs defaultValue="by-date">
        <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50 ring-1 ring-border">
          <TabsTrigger value="by-date" className="flex items-center text-sm font-bold data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-border transition-all">
            <Calendar className="mr-2 h-4 w-4" />
            Por Fecha
          </TabsTrigger>
          <TabsTrigger value="by-exercise" className="flex items-center text-sm font-bold data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-border transition-all">
            <TrendingUp className="mr-2 h-4 w-4" />
            Por Ejercicio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="by-date" className="mt-5 space-y-6">
          {dateGroups.map((group, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">{group.date}</h3>
              </div>
              {group.workouts.map((workout, wIndex) => (
                <Card key={wIndex} className="shadow-md border-2 border-border transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                        <Dumbbell className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">{workout.exercise}</CardTitle>
                        <CardDescription>{workout.workoutType}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Total reps</p>
                        <p className="text-3xl font-extrabold tabular-nums text-accent">{workout.totalReps}</p>
                      </div>

                      {workout.workoutType === "Max Reps" && (
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Máxima</p>
                          <p className="text-3xl font-extrabold tabular-nums text-foreground">{workout.maxReps}</p>
                        </div>
                      )}

                      {workout.workoutType === "Sub Max" && (
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Objetivo</p>
                          <p className="text-3xl font-extrabold tabular-nums text-foreground">{workout.targetReps}</p>
                        </div>
                      )}

                      {workout.workoutType === "Volumen Escalera" && (
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Ciclos</p>
                          <p className="text-3xl font-extrabold tabular-nums text-foreground">{workout.cycles}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="by-exercise" className="mt-5 space-y-6">
          {exerciseGroups.map((group, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">{group.name}</h3>
              {group.workouts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin entrenamientos registrados</p>
              ) : (
                group.workouts.map((workout, wIndex) => (
                  <Card key={wIndex} className="shadow-md border-2 border-border transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                          <Dumbbell className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold">{workout.workoutType}</CardTitle>
                          <CardDescription>{formatDate(workout.date)}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Total reps</p>
                          <p className="text-3xl font-extrabold tabular-nums text-accent">{workout.totalReps}</p>
                        </div>

                        {workout.workoutType === "Max Reps" && (
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Máxima</p>
                            <p className="text-3xl font-extrabold tabular-nums text-foreground">{workout.maxReps}</p>
                          </div>
                        )}

                        {workout.workoutType === "Sub Max" && (
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Objetivo</p>
                            <p className="text-3xl font-extrabold tabular-nums text-foreground">{workout.targetReps}</p>
                          </div>
                        )}

                        {workout.workoutType === "Volumen Escalera" && (
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Ciclos</p>
                            <p className="text-3xl font-extrabold tabular-nums text-foreground">{workout.cycles}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
