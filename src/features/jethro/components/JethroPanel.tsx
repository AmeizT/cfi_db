import { useState } from "react"
import { useRouter } from "next/navigation"
import { History, Maximize2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    useArchiveJethroConversation,
    useJethroConversations,
    useJethroStatus,
} from "../hooks/use-jethro"
import { useJethroSession } from "../JethroSessionProvider"
import { JethroComposer } from "./JethroComposer"
import { JethroConversationHistory } from "./JethroConversationHistory"
import { JethroLogo } from "./JethroLogo"
import { JethroMessageList } from "./JethroMessageList"

export function JethroPanel({ onClose }: { onClose: () => void }) {
    const router = useRouter()
    const [showHistory, setShowHistory] = useState(false)
    const {
        conversationId,
        setConversationId,
        composer,
        setComposer,
        pendingMessage,
        messages,
        isSending,
        isConversationLoading,
        submitMessage,
        startNewConversation,
    } = useJethroSession()
    const conversations = useJethroConversations()
    const status = useJethroStatus()
    const archive = useArchiveJethroConversation()

    const submit = () => void submitMessage(composer)

    function maximize() {
        const query = conversationId ? `?conversation=${encodeURIComponent(conversationId)}` : ""
        router.push(`/ai${query}`)
        onClose()
    }

    return (
        <section role="dialog" aria-modal="true" aria-label="Jethro assistant" className="fixed inset-x-0 bottom-0 z-60 flex h-[calc(100dvh-4rem)] flex-col overflow-hidden rounded-t-2xl border border-border-subtle bg-background shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[min(720px,calc(100dvh-8rem))] sm:w-105 sm:rounded-2xl">
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border-subtle px-4">
                <JethroLogo />
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-semibold">Jethro</h2>{status.data?.mock_mode && <Badge variant="secondary">Beta 0.1</Badge>}</div><p className="truncate text-xs text-muted-foreground">Your intelligent assistant for CFI Workspace</p></div>
                <Button size="icon" variant="ghost" onClick={() => setShowHistory(true)} aria-label="Conversation history"><History /></Button>
                <Button size="icon" variant="ghost" onClick={startNewConversation} aria-label="New conversation"><Plus /></Button>
                <Button size="icon" variant="ghost" onClick={maximize} aria-label="Open full Jethro page"><Maximize2 /></Button>
                <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close Jethro"><X /></Button>
            </header>
            <JethroMessageList messages={messages} pendingMessage={pendingMessage} loading={isSending || isConversationLoading} onPrompt={(value) => void submitMessage(value)} />
            <JethroComposer value={composer} onChange={setComposer} onSubmit={submit} loading={isSending} variant="relaxed" />
            {showHistory && <JethroConversationHistory conversations={conversations.data ?? []} activeId={conversationId} onSelect={(id) => { setConversationId(id); setShowHistory(false) }} onArchive={(id) => archive.mutate(id, { onSuccess: () => { if (id === conversationId) setConversationId(undefined) } })} onClose={() => setShowHistory(false)} />}
        </section>
    )
}
