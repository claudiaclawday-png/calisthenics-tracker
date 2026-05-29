"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "./logo"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/workout/select", label: "Entrenar", icon: Calendar },
    { href: "/history", label: "Historial", icon: BarChart3 },
  ]

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl shadow-[0_1px_3px_-1px_rgba(0,0,0,0.08)]">
        <div className="container flex h-14 items-center px-4 pt-safe">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 active:opacity-70 transition-opacity">
              <Logo />
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[calc(4rem+env(safe-area-inset-bottom))] items-center justify-around border-t border-border/80 bg-background/90 backdrop-blur-xl shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.08)] pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-full w-full flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-90",
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span className="absolute top-1.5 h-1 w-7 rounded-full bg-accent shadow-sm animate-in fade-in duration-200" />
              )}
              <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
              <span className="text-[11px] font-bold leading-none">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
