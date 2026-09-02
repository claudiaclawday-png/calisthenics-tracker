"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useWorkoutStore } from "@/lib/workout-store"
import ComplementWorkout from "@/components/complement-workout"
import { Timer, CheckCircle2, ArrowLeft, Sparkles, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Complement {
  focus: string
  tagline: string
  exercises: string[]
}

export default function ComplementPage() {
  const { toast } = useToast()
  const [suggested, setSuggested] = useState<Complement | null>(null)
  const [allComplements, setAllComplements] = useState<Complement[]>([])
  const [selectedComplement, setSelectedComplement] = useState<Complement | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const suggestedComplement = useWorkoutStore.getState().getCurrentComplement()
    const complements = useWorkoutStore.getState().getAllComplements()
    setSuggested(suggestedComplement)
    setAllComplements(complements)
    setSelectedComplement(suggestedComplement)
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

  if (!suggested || !selectedComplement) {
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
            Enfocando: {selectedComplement.focus} · {selectedComplement.tagline}
          </p>
        </div>
      </div>

      {/* Focus Selector */}
      <div className="mb-6 space-y-3">
        <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Enfoque</h2>
        <div className="space-y-3">
          {allComplements.map((comp) => {
            const isSelected = selectedComplement.focus === comp.focus
            const isSuggested = suggested.focus === comp.focus
            return (
              <button
                key={comp.focus}
                onClick={() => {
                  setSelectedComplement(comp)
                  setIsCompleted(false)
                }}
                className={cn(
                  "relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                  "min-h-11 active:scale-[0.98] active:shadow-inner",
                  isSelected
                    ? "border-accent bg-accent text-accent-foreground shadow-lg"
                    : "border-border bg-card text-foreground hover:border-accent/50 hover:shadow-md hover:bg-muted/50",
                )}
              >
                {isSuggested && (
                  <span
                    className={cn(
                      "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest",
                      isSelected
                        ? "bg-accent-foreground/20 text-accent-foreground"
                        : "bg-accent/10 text-accent ring-1 ring-accent/20",
                    )}
                  >
                    <Sparkles className="h-3 w-3" />
                    Hoy
                  </span>
                )}
                <div className="flex-1 min-w-0 pr-12">
                  <p className="font-extrabold text-base">{comp.focus}</p>
                  <p className={cn("text-sm", isSelected ? "text-accent-foreground/80" : "text-muted-foreground")}>
                    {comp.tagline}
                  </p>
                  <p className={cn("mt-1 text-xs", isSelected ? "text-accent-foreground/70" : "text-muted-foreground/80")}>
                    {comp.exercises.join(" · ")}
                  </p>
                </div>
                {isSelected && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-foreground shadow-sm">
                    <Check className="h-4 w-4 text-accent" strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <Card className="shadow-md border-2 border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
              <Timer className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{selectedComplement.focus}</CardTitle>
              <CardDescription>{selectedComplement.tagline}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isCompleted ? (
            <div className="space-y-6 py-8 text-center">
              <div className="relative mx-auto flex h-20 w-20 animate-in items-center justify-center rounded-full bg-accent/10 ring-2 ring-accent/20 zoom-in-50 speed-500">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full ring-2 ring-accent/40 animate-pulse"
                />
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
              key={selectedComplement.focus}
              focus={selectedComplement.focus}
              tagline={selectedComplement.tagline}
              exercises={selectedComplement.exercises}
              onComplete={handleComplete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
