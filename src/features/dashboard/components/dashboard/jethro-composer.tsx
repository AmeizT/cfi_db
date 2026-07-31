"use client"

import { useRef, type KeyboardEvent } from "react"
import { ArrowUp, AtSign, Link2, Plus } from "lucide-react"

import { useAutoResizeTextarea } from "../../hooks/use-auto-resize-textarea"
import { cn } from "@/lib/utils"

interface JethroComposerProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  compactTools?: boolean
  className?: string
}

export function JethroComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask Jethro anything...",
  compactTools = false,
  className,
}: JethroComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSubmit = value.trim().length > 0

  useAutoResizeTextarea(textareaRef, value)

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      if (canSubmit) onSubmit()
    }
  }

  return (
    <div className="p-1.5 h-fit rounded-[1.625rem] bg-linear-to-b from-blue-50 via-purple-100/70 to-orange-100/80">
      <div
        className={cn(
          "rounded-[1.25rem] border-none border-mauve-300/80 shadow-elevation-sm bg-background p-4",
          className
        )}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-9 max-h-35 w-full resize-none bg-transparent text-base leading-6 text-muted-foreground outline-none placeholder:text-muted"
        />

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ComposerTool label="Attach">
              <Plus className="size-4" />
            </ComposerTool>

            {!compactTools && (
              <>
                <ComposerTool label="Mention a report or member">
                  <AtSign className="size-4" />
                </ComposerTool>
                <ComposerTool label="Add link">
                  <Link2 className="size-4" />
                </ComposerTool>
              </>
            )}
          </div>

          <button
            type="button"
            title="Send to Jethro"
            aria-label="Send to Jethro"
            disabled={!canSubmit}
            onClick={onSubmit}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-white outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              canSubmit
                ? "bg-primary hover:bg-primary/90"
                : "cursor-not-allowed bg-primary/50"
            )}
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ComposerTool({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex size-[30px] items-center justify-center rounded-[7px] text-[#8b8d9c] outline-none transition hover:bg-[#ece9f5] hover:text-[#4b4d5c] focus-visible:ring-2 focus-visible:ring-[#26215c]"
    >
      {children}
    </button>
  )
}
