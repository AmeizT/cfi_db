import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

type FormButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const buttonStyles = cva(
    "h-13 w-full flex justify-center items-center gap-x-2 border-0 rounded-full text-[15px] font-semibold transition-colors duration-200 text-white bg-primary disabled:bg-primary disabled:opacity-80 disabled:text-white/50 dark:disabled:text-white/70 data-[variant=rounded]:rounded-full"
)

export function FormButton(props: FormButtonProps){
    return (
        <button {...props} className={cn(buttonStyles(), props.className)}>
            {props.children}
        </button>
    )
}