"use client"

import { useLayoutEffect, type RefObject } from "react"

export function useAutoResizeTextarea(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxHeight = 140
) {
  useLayoutEffect(() => {
    const textarea = ref.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [maxHeight, ref, value])
}
