import { emitAchievementEvent } from "./index"

declare global {
  interface Window {
    inspectTheInspector?: () => void
  }
}

let hintPrinted = false

export function installAchievementConsole(): () => void {
  if (typeof window === "undefined") return () => {}

  const previous = Object.getOwnPropertyDescriptor(window, "inspectTheInspector")
  if (previous && !previous.configurable) return () => {}

  function inspectTheInspector(): void {
    emitAchievementEvent("developer_console_secret_found")
    console.log(`Oh, look. Someone who reads console logs voluntarily.

🏆 Achievement unlocked: Inspecting the Inspector

Now get out of my DevTools. There are bugs in here
I'm not emotionally prepared to discuss.`)
  }

  Object.defineProperty(window, "inspectTheInspector", {
    value: inspectTheInspector,
    configurable: true,
    writable: true,
  })

  if (!hintPrinted) {
    console.info("%cPsst… inspecting the inspector?", "color: #C47A8A; font-weight: 600;")
    console.info("There's a hidden message here. Run inspectTheInspector() to find it.")
    hintPrinted = true
  }

  return () => {
    if (window.inspectTheInspector !== inspectTheInspector) return
    if (previous) Object.defineProperty(window, "inspectTheInspector", previous)
    else delete window.inspectTheInspector
  }
}
