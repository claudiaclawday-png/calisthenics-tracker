"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import WorkoutTimer from "@/components/workout-timer"
import { useWorkoutStore } from "@/lib/workout-store"
import { Check, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface VolumeWorkoutProps {
  onComplete: (data: any) => void
}

export default function VolumeWorkout({ onComplete }: VolumeWorkoutProps) {
  const { getLastMaxReps } = useWorkoutStore()
  const [maxReps, setMaxReps] = useState(10)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [currentRep, setCurrentRep] = useState(1)
  const [showTimer, setShowTimer] = useState(false)
  const [completedReps, setCompletedReps] = useState<number[][]>([])
  const totalCycles = 5
  const restTime = 30

  useEffect(() => {
    const lastMax = getLastMaxReps()
    setMaxReps(lastMax > 0 ? lastMax : 10)
    setCompletedReps(Array(totalCycles).fill([]))
  }, [getLastMaxReps])

  const handleCompleteRep = () => {
    const newCompletedReps = [...completedReps]
    if (!newCompletedReps[currentCycle - 1]) {
      newCompletedReps[currentCycle - 1] = []
    }
    newCompletedReps[currentCycle - 1] = [...newCompletedReps[currentCycle - 1], currentRep]
    setCompletedReps(newCompletedReps)

    if (currentRep < maxReps) {
      setCurrentRep(currentRep + 1)
      setShowTimer(true)
    } else {
      if (currentCycle < totalCycles) {
        setCurrentRep(1)
        setCurrentCycle(currentCycle + 1)
        setShowTimer(true)
      } else {
        handleComplete()
      }
    }
  }

  const handleTimerComplete = () => {
    setShowTimer(false)
  }

  const handleComplete = () => {
    const totalReps = completedReps.flat().reduce((a, b) => a + b, 0)

    onComplete({
      cycles: totalCycles,
      maxReps: maxReps,
      completedReps: completedReps,
      totalReps: totalReps,
    })
  }

  const calculateProgress = () => {
    const totalRepsInWorkout = totalCycles * ((maxReps * (maxReps + 1)) / 2)
    const completedRepsCount = completedReps.flat().reduce((a, b) => a + b, 0)
    return (completedRepsCount / totalRepsInWorkout) * 100
  }

  return (
    <div className="space-y-6">
      {showTimer ? (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-1">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
              <Trophy className="h-6 w-6 text-sky-500" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Descanso</p>
            <p className="text-xs text-muted-foreground">Ciclo {currentCycle} · Rep {currentRep} completada</p>
          </div>
          <WorkoutTimer duration={restTime} onComplete={handleTimerComplete} autoStart={true} />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Ciclo {currentCycle} de {totalCycles}
              </p>
              <p className="text-sm text-muted-foreground">
                Repetición {currentRep} de {maxReps}
              </p>
            </div>
            <Progress value={calculateProgress()} className="h-2.5" />
          </div>

          <Card className="shadow-md border-2 border-border">
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="text-8xl font-extrabold tabular-nums tracking-tight text-primary">{currentRep}</span>
                  <p className="text-sm font-semibold text-muted-foreground">Repeticiones a realizar</p>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-14 text-base font-bold shadow-lg active:scale-95 active:shadow-md transition-all duration-150"
                  onClick={handleCompleteRep}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Completar {currentRep} {currentRep === 1 ? "rep" : "reps"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-2 border-border">
            <CardContent className="pt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Progreso del ciclo</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: maxReps }, (_, i) => i + 1).map((rep) => {
                  const isCompleted = completedReps[currentCycle - 1]?.includes(rep)
                  const isCurrent = rep === currentRep

                  return (
                    <div
                      key={rep}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200",
                        isCompleted
                          ? "bg-primary text-primary-foreground shadow-md"
                          : isCurrent
                            ? "border-2 border-primary bg-background shadow-md ring-2 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {rep}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {currentCycle > 1 && (
            <Card className="shadow-md border-2 border-border">
              <CardContent className="pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Ciclos completados</p>
                <div className="space-y-2">
                  {completedReps.slice(0, currentCycle - 1).map((cycle, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                      <span className="text-sm font-semibold text-muted-foreground">Ciclo {index + 1}</span>
                      <span className="font-bold tabular-nums text-lg">
                        {cycle.reduce((a, b) => a + b, 0)} reps
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
