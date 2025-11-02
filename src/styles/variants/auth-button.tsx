import { cva } from "class-variance-authority"

export const authButton = cva(
    "h-12 w-full flex justify-center items-center gap-x-2 border-0 rounded-xl text-[15px] font-semibold transition-colors duration-200 text-white bg-primary disabled:bg-primary disabled:text-body-muted dark:disabled:text-white/70 data-[variant=rounded]:rounded-full"
)

