import { cn } from "@/lib/utils"
import { authButton } from "@/styles/variants/auth-button"

type FormButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function FormButton(props: FormButtonProps){
    return (
        <button {...props} className={cn(authButton(), props.className)}>
            {props.children}
        </button>
    )
}