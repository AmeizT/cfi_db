import { cva } from "class-variance-authority"

export const formButtonVariants = cva(
    "h-10 w-full flex justify-center items-center gap-x-2 border-0 rounded-lg text-[15px] font-semibold transition-colors duration-200 text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-primary disabled:bg-zinc-200 disabled:text-body-muted dark:disabled:bg-primary/40 dark:disabled:text-white/70 dark:hover:bg-primary/90 data-[variant=rounded]:rounded-full"
)

export const flexBox = cva(
    "flex data-[align=center]:justify-center data-[align=between]:justify-between data-[orientation=vertical]:flex-col"
)