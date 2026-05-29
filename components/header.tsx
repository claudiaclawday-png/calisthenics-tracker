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
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-lg shadow-[0_1px_3px_-1px_rgba(0,0,0,0.07)]">
        <div className="container flex h-14 items-center px-4 pt-safe">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[calc(4rem+env(safe-area-inset-bottom))] items-center justify-around border-t bg-background/95 backdrop-blur-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-full w-full flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span className="absolute top-1 h-1 w-8 rounded-full bg-primary" />
              )}
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
