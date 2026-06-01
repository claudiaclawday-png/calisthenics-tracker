"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import WorkoutTimer from "@/components/workout-timer"
import { Check, Trophy } from "lucide-react"

interface VolumeWorkoutProps {
  onComplete: (data: any) => void
}

export default function VolumeWorkout({ onComplete }: VolumeWorkoutProps) {
  const [currentCycle, setCurrentCycle] = useState(1)
  const [currentRep, setCurrentRep] = useState(1)
  const [showTimer, setShowTimer] = useState(false)
  const [completedReps, setCompletedReps] = useState<number[][]>([])
  const [cycleCompleted, setCycleCompleted] = useState(false)
  const totalCycles = 5
  const restTime = 30

  useEffect(() => {
    setCompletedReps(Array(totalCycles).fill([]))
  }, [])

  const handleCompleteRep = () => {
    const newCompletedReps = [...completedReps]
    if (!newCompletedReps[currentCycle - 1]) {
      newCompletedReps[currentCycle - 1] = []
    }
    newCompletedReps[currentCycle - 1] = [...newCompletedReps[currentCycle - 1], currentRep]
    setCompletedReps(newCompletedReps)

    setCurrentRep(currentRep + 1)
    setShowTimer(true)
  }

  const handleEndCycle = () => {
    setCycleCompleted(true)
    if (currentCycle < totalCycles) {
      setCurrentRep(1)
      setCurrentCycle(currentCycle + 1)
      setShowTimer(true)
    } else {
      handleComplete()
    }
  }

  const handleTimerComplete = () => {
    setShowTimer(false)
    setCycleCompleted(false)
  }

  const handleComplete = () => {
    const totalReps = completedReps.flat().reduce((a, b) => a + b, 0)

    onComplete({
      cycles: totalCycles,
      completedReps: completedReps,
      totalReps: totalReps,
    })
  }

  const calculateProgress = () => {
    const completedCycles = completedReps.filter(cycle => cycle.length > 0).length
    return (completedCycles / totalCycles) * 100
  }

  return (
    <div className="space-y-6">
      {showTimer ? (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-1">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground">Descanso</p>
            <p className="text-xs text-muted-foreground">
              {cycleCompleted 
                ? `Ciclo ${currentCycle - 1} terminado · Iniciando ciclo ${currentCycle}`
                : `Ciclo ${currentCycle} · Rep ${currentRep - 1} completada`
              }
            </p>
          </div>
          <WorkoutTimer duration={restTime} onComplete={handleTimerComplete} autoStart={true} />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="text-center space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Ciclo {currentCycle} de {totalCycles}
              </p>
              <p className="text-sm text-muted-foreground">
                Repetición {currentRep}
              </p>
            </div>
            <Progress value={calculateProgress()} className="h-2.5 bg-muted [&>div]:bg-accent" />
          </div>

          <Card className="shadow-md border-2 border-border">
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="text-8xl font-extrabold tabular-nums tracking-tight text-accent">{currentRep}</span>
                  <p className="text-sm font-semibold text-muted-foreground">Repeticiones a realizar</p>
                </div>

                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-base font-extrabold shadow-xl bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 active:shadow-lg transition-all duration-150"
                    onClick={handleCompleteRep}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Completar {currentRep} {currentRep === 1 ? "rep" : "reps"}
                  </Button>

                  {completedReps[currentCycle - 1]?.length > 0 && (
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full h-12 text-base font-bold border-2 border-destructive/50 text-destructive hover:bg-destructive/10 active:scale-95 transition-all duration-150"
                      onClick={handleEndCycle}
                    >
                      Terminar ciclo {currentCycle}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-2 border-border">
            <CardContent className="pt-5">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Progreso del ciclo</p>
              <div className="flex flex-wrap gap-2">
                {completedReps[currentCycle - 1]?.map((rep, index) => (
                  <div
                    key={index}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold bg-accent text-accent-foreground shadow-md"
                  >
                    {rep}
                  </div>
                ))}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold border-2 border-accent bg-background shadow-md ring-2 ring-accent/20">
                  {currentRep}
                </div>
              </div>
            </CardContent>
          </Card>

          {currentCycle > 1 && (
            <Card className="shadow-md border-2 border-border">
              <CardContent className="pt-5">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Ciclos completados</p>
                <div className="space-y-2">
                  {completedReps.slice(0, currentCycle - 1).map((cycle, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl bg-accent/5 px-4 py-3 border border-accent/10">
                      <span className="text-sm font-semibold text-muted-foreground">Ciclo {index + 1}</span>
                      <span className="font-bold tabular-nums text-lg text-accent">
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
