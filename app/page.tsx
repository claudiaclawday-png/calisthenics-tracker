import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WorkoutSchedule from "@/components/workout-schedule"
import RecentWorkouts from "@/components/recent-workouts"
import Logo from "@/components/logo"
import { History, Flame } from "lucide-react"

export default function Home() {
  return (
    <div className="container px-4 py-6 md:py-10">
      <div className="flex flex-col space-y-8">
        {/* Hero */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-2xl bg-accent/10 p-5 shadow-sm ring-1 ring-accent/20">
            <Logo size={48} showText={false} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Calisthenics Tracker</h1>
            <p className="mt-1 text-muted-foreground text-base">Seguimiento de rutina y progreso</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Workout Card */}
          <Card className="shadow-md border-2 border-border transition-shadow hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
                  <Flame className="h-4 w-4 text-accent" />
                </div>
                <CardTitle className="text-lg">Entrenamiento de Hoy</CardTitle>
              </div>
              <CardDescription>Tu entrenamiento programado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <WorkoutSchedule />
              <div>
                <Link href="/workout/select">
                  <Button size="lg" className="w-full h-12 text-base font-extrabold shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 transition-all duration-150">
                    Comenzar Entrenamiento
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Workouts Card */}
          <Card className="shadow-md border-2 border-border transition-shadow hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <History className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Entrenamientos Recientes</CardTitle>
              </div>
              <CardDescription>Tus últimos resultados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <RecentWorkouts />
              <div>
                <Link href="/history">
                  <Button variant="outline" size="lg" className="w-full h-12 text-base font-extrabold active:scale-95 transition-all duration-150">
                    Ver Historial Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
