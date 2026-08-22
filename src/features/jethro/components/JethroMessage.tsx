import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { JethroMessage as Message } from "../schemas/jethro"
import { JethroLogo } from "./JethroLogo"
import { JethroResultCard } from "./JethroResultCard"

export function JethroMessage({ message }: { message: Message }) {
    if (message.role === "tool" || message.role === "system") return null
    const isUser = message.role === "user"
    return (
        <article className={cn("flex items-start gap-2", isUser && "justify-end")}>
            {!isUser && <Avatar className="size-7"><AvatarFallback><JethroLogo className="size-7 rounded-full" /></AvatarFallback></Avatar>}
            <div className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm", isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                {message.structured_content && <JethroResultCard result={message.structured_content} />}
            </div>
        </article>
    )
}
