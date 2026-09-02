"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

const LIGHT_THEME_COLOR = "#7c3aed"
const DARK_THEME_COLOR = "#0f0a1f"

export default function ThemeColor() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (!meta) return
    meta.setAttribute("content", resolvedTheme === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR)
  }, [resolvedTheme])

  return null
}
