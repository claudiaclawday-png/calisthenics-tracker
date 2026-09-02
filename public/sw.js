self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

let timerId = null

function clearTimer() {
  if (timerId) {
    clearTimeout(timerId)
    timerId = null
  }
}

function scheduleNotification(duration, startTime) {
  clearTimer()
  const remaining = (startTime + duration * 1000) - Date.now()
  if (remaining <= 0) {
    fireNotification()
    return
  }
  timerId = setTimeout(fireNotification, remaining)
}

function fireNotification() {
  timerId = null
  if (typeof Notification !== "undefined" && Notification.permission === "denied") return
  self.registration
    .showNotification("Descanso terminado", {
      body: "¡A la próxima serie!",
      vibrate: [200, 100, 200, 100, 200, 100, 400],
      requireInteraction: true,
      tag: "workout-timer",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    })
    .catch(() => {})
}

// --- Daily reminder (Entrenamiento de hoy) ---

let dailyTimerId = null

function clearDailyTimer() {
  if (dailyTimerId) {
    clearTimeout(dailyTimerId)
    dailyTimerId = null
  }
}

function dailyNotificationTitle(data) {
  return data.workoutDayName
    ? `Entrenamiento de hoy · ${data.workoutDayName}`
    : "Entrenamiento de hoy"
}

function dailyNotificationOptions(data) {
  return {
    body: `Hoy: ${data.exercise} — ${data.workoutType}`,
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    requireInteraction: true,
    tag: "daily-reminder",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  }
}

function scheduleDailyReminder(data) {
  clearDailyTimer()
  const { triggerAt } = data
  if (typeof triggerAt !== "number") return

  const now = Date.now()
  const MAX_AHEAD_MS = 8 * 24 * 60 * 60 * 1000
  // Ignore stale timers and timers too far in the future
  if (triggerAt <= now || triggerAt - now > MAX_AHEAD_MS) return

  // Progressive enhancement: Notification Triggers API when available
  try {
    if (typeof NotificationTrigger !== "undefined" && "showTrigger" in Notification.prototype) {
      const options = dailyNotificationOptions(data)
      options.showTrigger = new NotificationTrigger(triggerAt)
      self.registration.showNotification(dailyNotificationTitle(data), options).catch(() => {})
    }
  } catch (error) {}

  // Base path: setTimeout while the service worker stays alive
  dailyTimerId = setTimeout(() => {
    dailyTimerId = null
    self.registration
      .showNotification(dailyNotificationTitle(data), dailyNotificationOptions(data))
      .catch(() => {})
  }, triggerAt - now)
}

self.addEventListener("message", (event) => {
  if (!event.data || typeof event.data !== "object") return
  const { type } = event.data

  if (type === "SKIP_WAITING") {
    self.skipWaiting()
    return
  }

  if (type === "TIMER_START") {
    const { duration, startTime } = event.data
    if (typeof duration !== "number" || typeof startTime !== "number") return
    scheduleNotification(duration, startTime)
    return
  }

  if (type === "TIMER_STOP") {
    clearTimer()
    return
  }

  if (type === "DAILY_REMINDER") {
    scheduleDailyReminder(event.data)
    return
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus()
      } else {
        self.clients.openWindow("/")
      }
    })
  )
})
