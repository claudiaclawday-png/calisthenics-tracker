"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useWorkoutStore } from "@/lib/workout-store"
import ComplementWorkout from "@/components/complement-workout"
import { Timer, CheckCircle2, ArrowLeft } from "lucide-react"

export default function ComplementPage() {
  const { toast } = useToast()
  const [complement, setComplement] = useState<{
    focus: string
    tagline: string
    exercises: string[]
  } | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    setComplement(useWorkoutStore.getState().getCurrentComplement())
  }, [])

  const handleComplete = (data: any) => {
    useWorkoutStore.getState().completeWorkout({
      ...data,
      date: new Date().toISOString(),
    })

    setIsCompleted(true)
    toast({
      title: "¡Complemento completado!",
      description: "Tu progreso ha sido guardado",
    })
  }

  if (!complement) {
    return (
      <div className="container flex h-[60vh] items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6">
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors active:scale-90">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Complemento de 10 min</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Timer className="h-4 w-4" />
          <p className="text-sm font-semibold">
            Hoy: {complement.focus} · {complement.tagline}
          </p>
        </div>
      </div>

      <Card className="shadow-md border-2 border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
              <Timer className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{complement.focus}</CardTitle>
              <CardDescription>{complement.tagline}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isCompleted ? (
            <div className="space-y-6 py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 ring-2 ring-accent/20">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-foreground">¡Complemento completado!</h3>
                <p className="text-muted-foreground">Gran trabajo. Tu progreso fue guardado.</p>
              </div>
              <Link href="/">
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-extrabold shadow-xl bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 transition-all duration-150"
                >
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          ) : (
            <ComplementWorkout
              focus={complement.focus}
              tagline={complement.tagline}
              exercises={complement.exercises}
              onComplete={handleComplete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
