"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getJethroReply } from "../../lib/jethro"
import { cn } from "../../lib/utils"
import { JethroComposer } from "../../components/dashboard/jethro-composer"
import { JethroMark } from "../../components/dashboard/jethro-mark"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

interface JethroChatProps {
  initialMessage?: string
  userInitial?: string
}

export function JethroChat({
  initialMessage = "",
  userInitial = "N",
}: JethroChatProps) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const initialMessageSent = useRef(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!initialMessage || initialMessageSent.current) return
    initialMessageSent.current = true
    sendMessage(initialMessage)
    // sendMessage is deliberately excluded: the first URL message runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [isTyping, messages])

  function sendMessage(explicitMessage?: string) {
    const content = (explicitMessage ?? draft).trim()
    if (!content || isTyping) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }

    setMessages((current) => [...current, userMessage])
    setDraft("")
    setIsTyping(true)

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: getJethroReply(content),
        },
      ])
      setIsTyping(false)
    }, 850)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <header className="flex shrink-0 items-center gap-3.5 border-b border-[#e6e5ee] px-4 py-4 sm:px-7">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-[13px] font-bold text-[#4b4d5c] outline-none transition hover:text-[#26215c] focus-visible:ring-2 focus-visible:ring-[#26215c]"
        >
          <ArrowLeft className="size-3.75" strokeWidth={2.3} />
          Dashboard
        </button>

        <div className="flex items-center gap-2">
          <JethroMark className="size-[26px]" />
          <strong className="text-[14.5px]">Jethro AI</strong>
        </div>

        <span className="ml-auto hidden rounded-[5px] border border-[#e6e5ee] bg-[#f5f5f7] px-2 py-0.5 font-mono text-[11px] text-[#8b8d9c] sm:inline">
          cfiws/jethroai
        </span>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-7">
        <div className="mx-auto flex max-w-[720px] flex-col gap-[18px] px-4 sm:px-7">
          {messages.length === 0 && !isTyping && (
            <div className="py-20 text-center">
              <JethroMark className="mx-auto mb-4 size-10" iconClassName="size-5" />
              <h1 className="text-xl font-semibold">How can Jethro help?</h1>
              <p className="mt-2 text-sm text-[#8b8d9c]">
                Ask about reports, compliance, members, or financial activity.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              userInitial={userInitial}
            />
          ))}

          {isTyping && <TypingIndicator />}
        </div>
      </div>

      <footer className="shrink-0 border-t border-[#e6e5ee] px-4 pb-[22px] pt-4 sm:px-7">
        <div className="mx-auto max-w-[720px]">
          <JethroComposer
            value={draft}
            onChange={setDraft}
            onSubmit={() => sendMessage()}
            placeholder="Reply to Jethro..."
            compactTools
          />
        </div>
      </footer>
    </div>
  )
}

function MessageBubble({
  message,
  userInitial,
}: {
  message: ChatMessage
  userInitial: string
}) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex max-w-[82%] gap-2.5",
        isUser ? "self-end flex-row-reverse" : "self-start"
      )}
    >
      {isUser ? (
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-lg bg-[#f1effc] text-[11px] font-extrabold text-[#5b4bc4]">
          {userInitial}
        </span>
      ) : (
        <JethroMark className="size-[26px]" />
      )}

      <div
        className={cn(
          "rounded-[14px] px-[15px] py-[11px] text-[14.5px] leading-[1.55]",
          isUser
            ? "rounded-br bg-[#26215c] text-white"
            : "rounded-bl bg-[#f5f5f7] text-[#1b1c27]"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex max-w-[82%] self-start gap-2.5">
      <JethroMark className="size-[26px]" />
      <div className="rounded-[14px] rounded-bl bg-[#f5f5f7] px-[15px] py-[11px]">
        <div className="flex gap-1 px-[3px] py-1.5" aria-label="Jethro is typing">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="size-1.5 animate-[jethro-blink_1.2s_ease-in-out_infinite] rounded-full bg-[#8b8d9c]"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
