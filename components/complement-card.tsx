"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkoutStore } from "@/lib/workout-store"
import { Timer } from "lucide-react"

export default function ComplementCard() {
  const [focus, setFocus] = useState("")
  const [tagline, setTagline] = useState("")
  const { getCurrentComplement } = useWorkoutStore()

  useEffect(() => {
    const { focus, tagline } = getCurrentComplement()
    setFocus(focus)
    setTagline(tagline)
  }, [getCurrentComplement])

  return (
    <Card className="shadow-md border-2 border-border transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
            <Timer className="h-4 w-4 text-accent" />
          </div>
          <CardTitle className="text-lg">Complemento de 10 min</CardTitle>
        </div>
        <CardDescription>Bloque opcional para piernas, core y plano horizontal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 rounded-2xl bg-muted/50 p-5 ring-1 ring-border">
          <div>
            <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Hoy</p>
            <p className="text-base font-extrabold">{focus || "…"}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tagline}</p>
        </div>
        <div>
          <Link href="/workout/complement">
            <Button
              size="lg"
              className="w-full h-12 text-base font-extrabold shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 transition-all duration-150"
            >
              Comenzar Complemento
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
