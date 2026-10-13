"use client"

import { useSyncExternalStore } from "react"
import { getSealyModeSnapshot, getServerSealyModeSnapshot, subscribeToSealyMode } from "@/lib/sealy-mode"

export function useSealyMode() {
  return useSyncExternalStore(subscribeToSealyMode, getSealyModeSnapshot, getServerSealyModeSnapshot)
}
