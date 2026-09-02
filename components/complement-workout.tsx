"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, RotateCcw, Check, Trophy, Dumbbell, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComplementWorkoutProps {
  focus: string
  tagline: string
  exercises: string[]
  onComplete: (data: any) => void
}

// Hard cap: 10 minutes per session
const SESSION_DURATION = 600
const WORK_DURATION = 40
const REST_DURATION = 20

interface SessionState {
  sessionRemaining: number
  intervalRemaining: number
  isWork: boolean
  exerciseIndex: number
  round: number
}

const initialSession = (): SessionState => ({
  sessionRemaining: SESSION_DURATION,
  intervalRemaining: WORK_DURATION,
  isWork: true,
  exerciseIndex: 0,
  round: 1,
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function ComplementWorkout({ focus, exercises, onComplete }: ComplementWorkoutProps) {
  const [session, setSession] = useState<SessionState>(initialSession)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [repsByExercise, setRepsByExercise] = useState<number[]>(() => exercises.map(() => 0))

  const exercisesRef = useRef(exercises)
  const onCompleteRef = useRef(onComplete)
  const completedRef = useRef(false)

  useEffect(() => {
    exercisesRef.current = exercises
    onCompleteRef.current = onComplete
  }, [exercises, onComplete])

  // Reset all state when the focus/exercises change
  useEffect(() => {
    completedRef.current = false
    setSession(initialSession())
    setIsRunning(false)
    setHasStarted(false)
    setRepsByExercise(exercises.map(() => 0))
  }, [focus, exercises])

  // Single 1s interval driving the session countdown + interval transitions
  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      setSession((prev) => {
        const sessionRemaining = prev.sessionRemaining - 1

        // Hard cap reached: freeze at 0 (auto-finish handled by effect below)
        if (sessionRemaining <= 0) {
          return { ...prev, sessionRemaining: 0 }
        }

        let { intervalRemaining, isWork, exerciseIndex, round } = prev
        intervalRemaining -= 1

        if (intervalRemaining <= 0) {
          if (isWork) {
            // Work finished -> rest
            isWork = false
            intervalRemaining = REST_DURATION
          } else {
            // Rest finished -> next exercise (new round after a full pass)
            isWork = true
            intervalRemaining = WORK_DURATION
            exerciseIndex = (exerciseIndex + 1) % exercisesRef.current.length
            if (exerciseIndex === 0) round += 1
          }
        }

        return { sessionRemaining, intervalRemaining, isWork, exerciseIndex, round }
      })
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning])

  const handleComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    setIsRunning(false)
    onCompleteRef.current({
      exercise: focus,
      workoutType: "Complemento",
      totalReps: repsByExercise.reduce((a, b) => a + b, 0),
      rounds: session.round,
      repsByExercise,
      durationMin: 10,
    })
  }, [focus, repsByExercise, session.round])

  // Auto-finish when the session timer hits 0
  useEffect(() => {
    if (isRunning && session.sessionRemaining === 0) {
      handleComplete()
    }
  }, [isRunning, session.sessionRemaining, handleComplete])

  const handleStart = () => {
    setHasStarted(true)
    setIsRunning(true)
  }

  const handleRestart = () => {
    completedRef.current = false
    setSession(initialSession())
    setRepsByExercise(exercises.map(() => 0))
    setIsRunning(true)
  }

  const handleRepChange = (delta: number) => {
    setRepsByExercise((prev) => {
      const next = [...prev]
      next[session.exerciseIndex] = Math.max(0, next[session.exerciseIndex] + delta)
      return next
    })
  }

  const totalReps = repsByExercise.reduce((a, b) => a + b, 0)
  const nextExerciseIndex = (session.exerciseIndex + 1) % exercises.length

  return (
    <div className="space-y-6">
      {/* Session timer + round */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            {hasStarted ? "Tiempo restante" : "Duración total"}
          </p>
          <p className="text-xs font-extrabold uppercase tracking-widest text-accent">Ronda {session.round}</p>
        </div>
        <div className="text-center">
          <p className="text-5xl font-extrabold tabular-nums tracking-tight text-foreground">
            {formatTime(session.sessionRemaining)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {hasStarted ? "Trabajo 40s · Descanso 20s" : "Circuito: 40s de trabajo · 20s de descanso"}
          </p>
        </div>
        <Progress
          value={((SESSION_DURATION - session.sessionRemaining) / SESSION_DURATION) * 100}
          className="h-2.5 bg-muted [&>div]:bg-accent"
        />
      </div>

      {/* Current interval */}
      <Card className="shadow-md border-2 border-border">
        <CardContent className="pt-6">
          {session.isWork ? (
            <div className="space-y-8">
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
                  <Dumbbell className="h-6 w-6 text-accent" />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-accent">Trabajo</p>
                <p className="text-2xl font-extrabold leading-tight text-foreground">{exercises[session.exerciseIndex]}</p>
                <p className="text-4xl font-extrabold tabular-nums tracking-tight text-accent">{session.intervalRemaining}s</p>
              </div>

              {/* Reps stepper */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center gap-5">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRepChange(-1)}
                    className="h-16 w-16 rounded-2xl border-2 border-accent/30 shadow-sm active:scale-90 active:shadow-inner transition-all duration-150 hover:bg-accent/5 hover:border-accent/50"
                  >
                    <Minus className="h-7 w-7 text-accent" />
                  </Button>
                  <span className="min-w-[110px] text-center text-6xl font-extrabold tabular-nums tracking-tight text-accent">
                    {repsByExercise[session.exerciseIndex]}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRepChange(1)}
                    className="h-16 w-16 rounded-2xl border-2 border-accent/30 shadow-sm active:scale-90 active:shadow-inner transition-all duration-150 hover:bg-accent/5 hover:border-accent/50"
                  >
                    <Plus className="h-7 w-7 text-accent" />
                  </Button>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">Repeticiones</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Descanso</p>
              <p className="text-5xl font-extrabold tabular-nums tracking-tight text-accent">{session.intervalRemaining}s</p>
              <p className="text-sm text-muted-foreground">
                Siguiente: <span className="font-bold text-foreground">{exercises[nextExerciseIndex]}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-exercise running totals */}
      <Card className="shadow-md border-2 border-border">
        <CardContent className="pt-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Reps por ejercicio</p>
          <div className="space-y-2">
            {exercises.map((name, index) => (
              <div
                key={name}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
                  session.isWork && index === session.exerciseIndex
                    ? "border-accent/30 bg-accent/10"
                    : "border-accent/10 bg-accent/5",
                )}
              >
                <span className="text-sm font-semibold text-muted-foreground">{name}</span>
                <span className="text-lg font-bold tabular-nums text-accent">{repsByExercise[index]} reps</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 ring-1 ring-border">
            <span className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="text-lg font-extrabold tabular-nums text-foreground">{totalReps} reps</span>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="space-y-3">
        {!hasStarted ? (
          <Button
            size="lg"
            onClick={handleStart}
            className="w-full h-14 text-base font-extrabold shadow-xl bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 active:shadow-lg transition-all duration-150"
          >
            <Play className="mr-2 h-5 w-5" />
            Comenzar Circuito
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              onClick={handleComplete}
              className="w-full h-14 text-base font-extrabold shadow-xl bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 active:shadow-lg transition-all duration-150"
            >
              <Check className="mr-2 h-5 w-5" />
              Finalizar
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleRestart}
              className="w-full h-12 font-extrabold active:scale-95 transition-all duration-150"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reiniciar
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
