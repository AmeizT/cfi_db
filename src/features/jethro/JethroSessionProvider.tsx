"use client"

import * as React from "react"

import {
    useJethroConversation,
    useSendJethroMessage,
} from "./hooks/use-jethro"
import type { JethroMessage } from "./schemas/jethro"

type JethroSessionContextValue = {
    conversationId?: string
    setConversationId: (id?: string) => void
    composer: string
    setComposer: (value: string) => void
    pendingMessage?: string
    messages: JethroMessage[]
    isSending: boolean
    isConversationLoading: boolean
    submitMessage: (message: string) => Promise<string | undefined>
    startNewConversation: () => void
}

const JethroSessionContext = React.createContext<JethroSessionContextValue | null>(null)
const SESSION_STORAGE_KEY = "cfi-jethro-active-conversation"
const SESSION_CHANGE_EVENT = "cfi-jethro-session-change"
let memoryConversationId: string | undefined

function readStoredConversation() {
    if (typeof window === "undefined") return undefined
    try {
        return window.sessionStorage.getItem(SESSION_STORAGE_KEY) ?? memoryConversationId
    } catch {
        return memoryConversationId
    }
}

function subscribeToStoredConversation(onStoreChange: () => void) {
    const onStorage = (event: StorageEvent) => {
        if (event.storageArea === window.sessionStorage && event.key === SESSION_STORAGE_KEY) {
            onStoreChange()
        }
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(SESSION_CHANGE_EVENT, onStoreChange)
    return () => {
        window.removeEventListener("storage", onStorage)
        window.removeEventListener(SESSION_CHANGE_EVENT, onStoreChange)
    }
}

export function JethroSessionProvider({ children }: { children: React.ReactNode }) {
    const conversationId = React.useSyncExternalStore(
        subscribeToStoredConversation,
        readStoredConversation,
        () => undefined,
    )
    const [composer, setComposer] = React.useState("")
    const [pendingMessage, setPendingMessage] = React.useState<string>()
    const conversation = useJethroConversation(conversationId)
    const send = useSendJethroMessage()

    const setConversationId = React.useCallback((id?: string) => {
        memoryConversationId = id
        try {
            if (id) window.sessionStorage.setItem(SESSION_STORAGE_KEY, id)
            else window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
        } catch {
            // The in-memory session remains usable when storage is unavailable.
        }
        window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
    }, [])

    const submitMessage = React.useCallback(async (message: string) => {
        const value = message.trim()
        if (!value || send.isPending) return undefined

        setComposer("")
        setPendingMessage(value)

        try {
            const response = await send.mutateAsync({
                message: value,
                conversation_id: conversationId,
            })
            setConversationId(response.conversation_id)
            return response.conversation_id
        } finally {
            setPendingMessage(undefined)
        }
    }, [conversationId, send, setConversationId])

    const startNewConversation = React.useCallback(() => {
        setConversationId(undefined)
        setComposer("")
        setPendingMessage(undefined)
    }, [setConversationId])

    const value = React.useMemo<JethroSessionContextValue>(() => ({
        conversationId,
        setConversationId,
        composer,
        setComposer,
        pendingMessage,
        messages: conversation.data?.messages ?? [],
        isSending: send.isPending,
        isConversationLoading: conversation.isFetching,
        submitMessage,
        startNewConversation,
    }), [
        composer,
        conversation.data?.messages,
        conversation.isFetching,
        conversationId,
        pendingMessage,
        send.isPending,
        setConversationId,
        startNewConversation,
        submitMessage,
    ])

    return (
        <JethroSessionContext.Provider value={value}>
            {children}
        </JethroSessionContext.Provider>
    )
}

export function useJethroSession() {
    const context = React.useContext(JethroSessionContext)
    if (!context) {
        throw new Error("useJethroSession must be used inside JethroSessionProvider")
    }
    return context
}
