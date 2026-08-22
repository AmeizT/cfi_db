import { cn } from "@/lib/utils"

interface JethroMarkProps {
  className?: string
  iconClassName?: string
}

export function JethroMark({ className, iconClassName }: JethroMarkProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-[#26215c]",
        className
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={cn("size-3.5 text-white", iconClassName)}
      >
        <path d="M4 18h4" />
        <path d="M4 12h9" />
        <path d="M4 6h14" />
      </svg>
    </span>
  )
}
