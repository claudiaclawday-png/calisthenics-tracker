"use client"

import { useEffect } from "react"
import { useWorkoutStore } from "@/lib/workout-store"

// Recordatorios: lunes, miércoles y viernes a las 16:00 (hora local)
const TRAINING_WEEKDAYS = [1, 3, 5]
const REMINDER_HOUR = 16
const MAX_AHEAD_MS = 8 * 24 * 60 * 60 * 1000

// Devuelve la fecha del próximo hueco de entrenamiento (L/X/V a las 16:00)
function getNextTrainingSlot(from: Date = new Date()): Date | null {
  for (let offset = 0; offset < 8; offset++) {
    const candidate = new Date(from)
    candidate.setDate(candidate.getDate() + offset)
    candidate.setHours(REMINDER_HOUR, 0, 0, 0)
    if (TRAINING_WEEKDAYS.includes(candidate.getDay()) && candidate.getTime() > from.getTime()) {
      return candidate
    }
  }
  return null
}

async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false
  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false
  try {
    return (await Notification.requestPermission()) === "granted"
  } catch {
    return false
  }
}

export default function DailyReminder() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return

    let cancelled = false

    const scheduleReminder = async () => {
      try {
        const granted = await ensureNotificationPermission()
        if (!granted || cancelled) return

        const slot = getNextTrainingSlot()
        if (!slot) return
        const triggerAt = slot.getTime()
        if (triggerAt <= Date.now() || triggerAt > Date.now() + MAX_AHEAD_MS) return

        // La rutina de hoy depende del progreso actual (historial persistido)
        const { dayName, workoutType, exercise } = useWorkoutStore.getState().getCurrentWorkoutDay()

        await navigator.serviceWorker.register("/sw.js")
        const registration = await navigator.serviceWorker.ready
        if (cancelled) return
        registration.active?.postMessage({
          type: "DAILY_REMINDER",
          workoutDayName: dayName,
          workoutType,
          exercise,
          triggerAt,
        })
      } catch {
        // Best-effort: si falla el permiso o el SW, no pasa nada
      }
    }

    // Esperar a que el store se rehidrate desde localStorage para leer el día correcto
    let unsubscribe: (() => void) | undefined
    if (useWorkoutStore.persist.hasHydrated()) {
      scheduleReminder()
    } else {
      unsubscribe = useWorkoutStore.persist.onFinishHydration(() => {
        scheduleReminder()
      })
    }

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  return null
}
