"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import WorkoutTimer from "@/components/workout-timer"
import { Plus, Minus, ChevronRight, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

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
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted ring-1 ring-border">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground">Descanso</p>
            <p className="text-xs text-muted-foreground">Serie {currentSet} de {totalSets} completada</p>
          </div>
          <WorkoutTimer duration={restTime} onComplete={handleTimerComplete} autoStart={true} />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="text-center space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Serie {currentSet} de {totalSets}
              </p>
              <p className="text-sm text-muted-foreground">Máximo de repeticiones posible</p>
            </div>
            <Progress value={(currentSet / totalSets) * 100} className="h-2.5" />
          </div>

          <Card className="shadow-md border-2 border-border">
            <CardContent className="pt-6">
              <div className="space-y-8">
                {/* Counter */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center gap-5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRepChange(reps[currentSet - 1] - 1)}
                      className="h-16 w-16 rounded-2xl border-2 shadow-sm active:scale-90 active:shadow-inner transition-all duration-150"
                    >
                      <Minus className="h-7 w-7" />
                    </Button>
                    <span className="min-w-[110px] text-center text-7xl font-extrabold tabular-nums tracking-tight text-foreground">
                      {reps[currentSet - 1]}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRepChange(reps[currentSet - 1] + 1)}
                      className="h-16 w-16 rounded-2xl border-2 shadow-sm active:scale-90 active:shadow-inner transition-all duration-150"
                    >
                      <Plus className="h-7 w-7" />
                    </Button>
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">Repeticiones</p>
                </div>

                {/* Quick Select */}
                <div className="space-y-3">
                  <p className="text-center text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Selección rápida</p>
                  <div className="grid grid-cols-4 gap-2">
                    {QUICK_REPS.map((quickRep) => (
                      <Button
                        key={quickRep}
                        variant={reps[currentSet - 1] === quickRep ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleRepChange(quickRep)}
                        className={cn(
                          "h-14 text-lg font-bold shadow-sm active:scale-95 transition-all duration-150",
                          reps[currentSet - 1] === quickRep && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        )}
                      >
                        {quickRep}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-14 text-base font-extrabold shadow-lg active:scale-95 active:shadow-md transition-all duration-150"
                  onClick={handleNextSet}
                >
                  {currentSet < totalSets ? (
                    <>Siguiente Serie <ChevronRight className="ml-1 h-5 w-5" /></>
                  ) : (
                    "Completar Entrenamiento"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {currentSet > 1 && (
            <Card className="shadow-md border-2 border-border">
              <CardContent className="pt-5">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Series anteriores</p>
                <div className="space-y-2">
                  {reps.slice(0, currentSet - 1).map((rep, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                      <span className="text-sm font-semibold text-muted-foreground">Serie {index + 1}</span>
                      <span className="font-bold tabular-nums text-lg text-foreground">{rep} reps</span>
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
