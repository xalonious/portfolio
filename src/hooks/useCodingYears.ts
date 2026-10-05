"use client"

import { useEffect, useState } from "react"
import { getCodingYears } from "@/lib/coding-years"

export function useCodingYears(initialYears: number): number {
  const [years, setYears] = useState(initialYears)

  useEffect(() => {
    const refresh = () => setYears(getCodingYears())
    refresh()
    const interval = window.setInterval(refresh, 60_000)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [])

  return years
}
