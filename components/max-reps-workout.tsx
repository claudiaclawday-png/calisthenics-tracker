"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import WorkoutTimer from "@/components/workout-timer"
import { Plus, Minus } from "lucide-react"

interface MaxRepsWorkoutProps {
  onComplete: (data: any) => void
}

const QUICK_REPS = [5, 10, 15, 20]

export default function MaxRepsWorkout({ onComplete }: MaxRepsWorkoutProps) {
  const [currentSet, setCurrentSet] = useState(1)
  const [reps, setReps] = useState<number[]>([0, 0, 0])
  const [showTimer, setShowTimer] = useState(false)
  const totalSets = 3
  const restTime = 300

  const handleRepChange = (value: number) => {
    const newReps = [...reps]
    newReps[currentSet - 1] = Math.max(0, value)
    setReps(newReps)
  }

  const handleNextSet = () => {
    if (currentSet < totalSets) {
      setShowTimer(true)
    } else {
      handleComplete()
    }
  }

  const handleTimerComplete = () => {
    setShowTimer(false)
    setCurrentSet(currentSet + 1)
  }

  const handleComplete = () => {
    onComplete({
      sets: totalSets,
      reps: reps,
      maxReps: Math.max(...reps),
      totalReps: reps.reduce((a, b) => a + b, 0),
    })
  }

  return (
    <div className="space-y-6">
      {showTimer ? (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Descanso</p>
            <p className="text-xs text-muted-foreground">Serie {currentSet} de {totalSets} completada</p>
          </div>
          <WorkoutTimer duration={restTime} onComplete={handleTimerComplete} autoStart={true} />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Serie {currentSet} de {totalSets}
              </p>
              <p className="text-xs text-muted-foreground">Máximo de repeticiones posible</p>
            </div>
            <Progress value={(currentSet / totalSets) * 100} className="h-2" />
          </div>

          <Card className="shadow-sm border">
            <CardContent className="pt-6">
              <div className="space-y-8">
                {/* Counter */}
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRepChange(reps[currentSet - 1] - 1)}
                      className="h-14 w-14 rounded-2xl border-2 shadow-sm"
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <span className="min-w-[100px] text-center text-7xl font-extrabold tabular-nums tracking-tight">
                      {reps[currentSet - 1]}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRepChange(reps[currentSet - 1] + 1)}
                      className="h-14 w-14 rounded-2xl border-2 shadow-sm"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Repeticiones</p>
                </div>

                {/* Quick Select */}
                <div className="space-y-3">
                  <p className="text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">Selección rápida</p>
                  <div className="grid grid-cols-4 gap-2">
                    {QUICK_REPS.map((quickRep) => (
                      <Button
                        key={quickRep}
                        variant={reps[currentSet - 1] === quickRep ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleRepChange(quickRep)}
                        className="h-12 text-lg font-bold shadow-sm"
                      >
                        {quickRep}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button size="lg" className="w-full h-12 text-base font-semibold shadow-sm" onClick={handleNextSet}>
                  {currentSet < totalSets ? "Siguiente Serie" : "Completar Entrenamiento"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {currentSet > 1 && (
            <Card className="shadow-sm border">
              <CardContent className="pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Series anteriores</p>
                <div className="space-y-2">
                  {reps.slice(0, currentSet - 1).map((rep, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <span className="text-sm font-medium text-muted-foreground">Serie {index + 1}</span>
                      <span className="font-bold tabular-nums">{rep} reps</span>
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
