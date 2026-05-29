"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw } from "lucide-react"

interface WorkoutTimerProps {
  duration: number
  onComplete: () => void
  autoStart?: boolean
}

export default function WorkoutTimer({ duration, onComplete, autoStart = false }: WorkoutTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(autoStart)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval as NodeJS.Timeout)
            setIsActive(false)
            onComplete()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, onComplete])

  useEffect(() => {
    setProgress((timeLeft / duration) * 100)
  }, [timeLeft, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(duration)
    setProgress(100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <span className="text-6xl font-extrabold tabular-nums tracking-tight">{formatTime(timeLeft)}</span>
      </div>

      <Progress value={progress} className="h-3" />

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTimer}
          disabled={timeLeft === 0}
          className="h-14 w-14 rounded-2xl border-2 shadow-sm"
        >
          {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          disabled={timeLeft === duration && !isActive}
          className="h-14 w-14 rounded-2xl border-2 shadow-sm"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
