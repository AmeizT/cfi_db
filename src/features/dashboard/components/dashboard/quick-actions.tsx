"use client"

import { useEffect, useState } from "react"
import { quickActions } from "../../lib/dashboard-data"

export function QuickActions() {
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function handleAction(label: string) {
    setToast(`Would open: ${label}`)
  }

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2.5">
        {quickActions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => handleAction(action.label)}
              className="flex items-center gap-2 rounded-[9px] border border-[#d7d6e3] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#1b1c27] outline-none transition hover:border-[#26215c] focus-visible:ring-2 focus-visible:ring-[#26215c] focus-visible:ring-offset-2"
            >
              <Icon className="size-4 text-[#4b4d5c]" />
              {action.label}
            </button>
          )
        })}
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-[9px] bg-[#201c4f] px-[18px] py-2.5 text-[13px] font-semibold text-white transition duration-200 ${
          toast
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        {toast ?? ""}
      </div>
    </>
  )
}
