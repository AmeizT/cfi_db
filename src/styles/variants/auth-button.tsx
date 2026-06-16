import { cva } from "class-variance-authority"

export const authButton = cva(
    "h-13 w-full flex justify-center items-center gap-x-2 border-0 rounded-full text-[15px] font-semibold transition-colors duration-200 text-white bg-mist-800 disabled:bg-mist-700 disabled:text-mist-500 dark:disabled:text-white/70 data-[variant=rounded]:rounded-full"
)

