import { useState } from "react"
import { History, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    useArchiveJethroConversation,
    useJethroConversation,
    useJethroConversations,
    useSendJethroMessage,
    useJethroStatus,
} from "../hooks/use-jethro"
import { JethroComposer } from "./JethroComposer"
import { JethroConversationHistory } from "./JethroConversationHistory"
import { JethroLogo } from "./JethroLogo"
import { JethroMessageList } from "./JethroMessageList"

export function JethroPanel({ onClose }: { onClose: () => void }) {
    const [conversationId, setConversationId] = useState<string>()
    const [composer, setComposer] = useState("")
    const [pendingMessage, setPendingMessage] = useState<string>()
    const [showHistory, setShowHistory] = useState(false)
    const conversations = useJethroConversations()
    const status = useJethroStatus()
    const conversation = useJethroConversation(conversationId)
    const send = useSendJethroMessage()
    const archive = useArchiveJethroConversation()
    const messages = conversation.data?.messages ?? []

    const submitMessage = (message: string) => {
        const value = message.trim()
        if (!value || send.isPending) return
        setComposer("")
        setPendingMessage(value)
        send.mutate({ message: value, conversation_id: conversationId }, {
            onSuccess: (response) => setConversationId(response.conversation_id),
            onSettled: () => setPendingMessage(undefined),
        })
    }

    const submit = () => submitMessage(composer)

    return (
        <section role="dialog" aria-modal="true" aria-label="Jethro assistant" className="fixed inset-x-0 bottom-0 z-60 flex h-[calc(100dvh-4rem)] flex-col overflow-hidden rounded-t-2xl border border-border-subtle bg-background shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[min(720px,calc(100dvh-8rem))] sm:w-105 sm:rounded-2xl">
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border-subtle px-4">
                <JethroLogo />
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-semibold">Jethro</h2>{(status.data?.mock_mode || send.data?.mock_mode) && <Badge variant="secondary">Beta 0.1</Badge>}</div><p className="truncate text-xs text-muted-foreground">Your intelligent assistant for CFI Workspace</p></div>
                <Button size="icon" variant="ghost" onClick={() => setShowHistory(true)} aria-label="Conversation history"><History /></Button>
                <Button size="icon" variant="ghost" onClick={() => { setConversationId(undefined); setComposer("") }} aria-label="New conversation"><Plus /></Button>
                <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close Jethro"><X /></Button>
            </header>
            <JethroMessageList messages={messages} pendingMessage={pendingMessage} loading={send.isPending || conversation.isFetching} onPrompt={submitMessage} />
            <JethroComposer value={composer} onChange={setComposer} onSubmit={submit} loading={send.isPending} />
            {showHistory && <JethroConversationHistory conversations={conversations.data ?? []} activeId={conversationId} onSelect={(id) => { setConversationId(id); setShowHistory(false) }} onArchive={(id) => archive.mutate(id, { onSuccess: () => { if (id === conversationId) setConversationId(undefined) } })} onClose={() => setShowHistory(false)} />}
        </section>
    )
}
