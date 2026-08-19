"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, History, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

export function JethroChat() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showHistory, setShowHistory] = React.useState(false)
    const submittedPrompt = React.useRef<string | null>(null)
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

    const requestedConversation = searchParams.get("conversation") ?? undefined
    const requestedPrompt = searchParams.get("prompt")?.trim() ?? ""

    React.useEffect(() => {
        if (requestedConversation && requestedConversation !== conversationId) {
            setConversationId(requestedConversation)
        }
    }, [conversationId, requestedConversation, setConversationId])

    React.useEffect(() => {
        if (!requestedPrompt || submittedPrompt.current === requestedPrompt) return
        submittedPrompt.current = requestedPrompt
        void submitMessage(requestedPrompt).then((id) => {
            if (id) router.replace(`/ai?conversation=${encodeURIComponent(id)}`)
        })
    }, [requestedPrompt, router, submitMessage])

    return (
        <section className="relative flex min-h-[calc(100dvh-var(--navbar-height))] flex-1 flex-col overflow-hidden bg-background">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border-subtle px-4 sm:px-6">
                <Button size="icon" variant="ghost" onClick={() => router.push("/")} aria-label="Back to Overview">
                    <ArrowLeft />
                </Button>
                <JethroLogo className="size-8" />
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h1 className="font-semibold">Jethro AI</h1>
                        {status.data?.mock_mode ? <Badge variant="secondary">Beta 0.1</Badge> : null}
                    </div>
                    <p className="hidden text-xs text-muted-foreground sm:block">Your intelligent assistant for CFI Workspace</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setShowHistory(true)} aria-label="Conversation history">
                        <History />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                        startNewConversation()
                        router.replace("/ai")
                    }} aria-label="New conversation">
                        <Plus />
                    </Button>
                </div>
            </header>

            <div className={cn("mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col", showHistory && "pointer-events-none opacity-60")}>
                <JethroMessageList
                    messages={messages}
                    pendingMessage={pendingMessage}
                    loading={isSending || isConversationLoading}
                    onPrompt={(prompt) => void submitMessage(prompt)}
                />
                <JethroComposer
                    value={composer}
                    onChange={setComposer}
                    onSubmit={() => void submitMessage(composer)}
                    loading={isSending}
                    variant="relaxed"
                />
            </div>

            {showHistory ? (
                <div className="absolute inset-0 z-10 ml-auto w-full max-w-md border-l border-border-subtle shadow-2xl">
                    <JethroConversationHistory
                        conversations={conversations.data ?? []}
                        activeId={conversationId}
                        onSelect={(id) => {
                            setConversationId(id)
                            setShowHistory(false)
                            router.replace(`/ai?conversation=${encodeURIComponent(id)}`)
                        }}
                        onArchive={(id) => archive.mutate(id, {
                            onSuccess: () => {
                                if (id === conversationId) startNewConversation()
                            },
                        })}
                        onClose={() => setShowHistory(false)}
                    />
                </div>
            ) : null}
        </section>
    )
}
