import { Archive, MessageSquareText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { JethroConversation } from "../schemas/jethro"

export function JethroConversationHistory({ conversations, activeId, onSelect, onArchive, onClose }: { conversations: JethroConversation[]; activeId?: string; onSelect: (id: string) => void; onArchive: (id: string) => void; onClose: () => void }) {
    return (
        <aside className="absolute inset-0 z-10 flex flex-col bg-background">
            <div className="flex h-14 items-center justify-between border-b px-4"><h3 className="font-semibold">Conversations</h3><Button size="icon" variant="ghost" onClick={onClose} aria-label="Close history"><X /></Button></div>
            <ScrollArea className="min-h-0 flex-1"><div className="space-y-1 p-2">{conversations.filter((item) => !item.is_archived).map((item) => (
                <div key={item.public_id} className={cn("group flex items-center rounded-lg", item.public_id === activeId && "bg-muted")}>
                    <button className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left" onClick={() => onSelect(item.public_id)}>
                        <MessageSquareText className="size-4 shrink-0" /><span className="min-w-0"><span className="block truncate text-sm font-medium">{item.title}</span><span className="block text-xs text-muted-foreground">{new Date(item.updated_at).toLocaleDateString()}</span></span>
                    </button>
                    <Button size="icon" variant="ghost" className="mr-1 opacity-70" onClick={() => onArchive(item.public_id)} aria-label={`Archive ${item.title}`}><Archive /></Button>
                </div>
            ))}</div></ScrollArea>
        </aside>
    )
}
