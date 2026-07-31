import { useEffect, useRef } from "react"
import { LoaderCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { JethroMessage as Message } from "../schemas/jethro"
import { JethroEmptyState } from "./JethroEmptyState"
import { JethroMessage } from "./JethroMessage"

export function JethroMessageList({ messages, pendingMessage, loading, onPrompt }: { messages: Message[]; pendingMessage?: string; loading: boolean; onPrompt: (value: string) => void }) {
    const endRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, pendingMessage, loading])
    if (!messages.length && !pendingMessage) {
        return (
            <div className="min-h-0 flex-1 overflow-hidden">
                <JethroEmptyState onSelect={onPrompt} />
            </div>
        )
    }
    return (
        <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 p-4" aria-live="polite">
                {messages.map((message, index) => <JethroMessage key={`${message.created_at}-${index}`} message={message} />)}
                {pendingMessage && <JethroMessage message={{ role: "user", content: pendingMessage, structured_content: null, created_at: new Date().toISOString() }} />}
                {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Jethro is thinking…</div>}
                <div ref={endRef} />
            </div>
        </ScrollArea>
    )
}
