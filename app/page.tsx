import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WorkoutSchedule from "@/components/workout-schedule"
import RecentWorkouts from "@/components/recent-workouts"
import Logo from "@/components/logo"
import { Dumbbell, History } from "lucide-react"

export default function Home() {
  return (
    <div className="container px-4 py-6 md:py-10">
      <div className="flex flex-col space-y-8">
        {/* Hero */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-2xl bg-primary/10 p-5 shadow-sm">
            <Logo size={48} showText={false} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Calisthenics Tracker</h1>
            <p className="mt-1 text-muted-foreground">Seguimiento de rutina y progreso</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Workout Card */}
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Dumbbell className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Entrenamiento de Hoy</CardTitle>
              </div>
              <CardDescription>Tu entrenamiento programado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <WorkoutSchedule />
              <div>
                <Link href="/workout/select">
                  <Button size="lg" className="w-full h-12 text-base font-semibold shadow-sm">
                    Comenzar Entrenamiento
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Workouts Card */}
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <History className="h-4 w-4 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Entrenamientos Recientes</CardTitle>
              </div>
              <CardDescription>Tus últimos resultados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <RecentWorkouts />
              <div>
                <Link href="/history">
                  <Button variant="outline" size="lg" className="w-full h-12 text-base font-semibold">
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
