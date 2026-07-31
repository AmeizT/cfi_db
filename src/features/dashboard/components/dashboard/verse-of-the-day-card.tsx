"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, ChevronRight, Copy, Share2 } from "lucide-react"
import { Votd } from "../../types/votd";
import { useVotd } from "../../hooks/use-votd";
import { format } from "date-fns";

export function VotdCard() {
  const {data: votd, isLoading} = useVotd()
  const [toast, setToast] = useState<string | null>(null)

  const formattedDate = votd?.date
  ? format(new Date(votd.date), "EEEE, dd MMM")
  : ""

  const shareText =
  `“${votd?.text}” — ${votd?.reference} (${votd?.translation?.name})`

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 1600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  async function copyVerse(message = "Copied") {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = shareText
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        textarea.remove()
      }

      setToast(message)
      return true
    } catch {
      setToast("Copy failed")
      return false
    }
  }

  async function shareVerse() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Verse of the Day",
          text: shareText,
        })
        return
      } catch {
        // The user may have dismissed the native share sheet.
      }
    }

    await copyVerse("Copied to share")
  }

  return (
    <section>
      <p className="mb-3.5 text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#8b8d9c]">
        Verse of the Day
      </p>

      <article className="rounded-[14px] border border-[#ecdfb4] bg-[#fbf3de] px-5 py-5.5 sm:px-7 sm:py-6.5">
        <div className="mb-4.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg border border-[#ecdfb4] bg-white text-[#26215c]">
              <BookOpen className="size-3.5" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#26215c]">
              Verse of the Day
            </span>
          </div>
          <time className="text-xs font-semibold text-[#4b4d5c]">
            {formattedDate}
          </time>
        </div>

        <blockquote className="mb-4 max-w-160 font-serif text-[19px] leading-[1.68] text-[#1b1c27]">
          {votd?.text}
        </blockquote>

        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          <cite className="not-italic text-[14.5px] font-bold text-[#1b1c27] before:mr-1 before:font-normal before:text-[#8b8d9c] before:content-['—']">
            {votd?.reference}
          </cite>
          <a
            href={votd?.translation?.license_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-[5px] border border-[#ded8f7] bg-[#f1effc] px-1.75 py-0.5 text-[10.5px] font-extrabold text-[#5b4bc4] outline-none focus-visible:ring-2 focus-visible:ring-[#26215c]"
          >
            {votd?.translation?.name}
          </a>
        </div>

        <Link
          href={votd?.translation?.license_url || "#"}
          className="hidden mb-4.5 _inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#5b4bc4] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#26215c]"
        >
          Read {votd?.reference}
          <ChevronRight className="size-3.25" strokeWidth={2.3} />
        </Link>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ecdfb4] pt-3.5">
          <p className="text-[11px] text-[#8b8d9c]">
            Text:{" "}
            <a
              href={votd?.translation?.license_url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {votd?.translation?.name}
            </a>
          </p>

          <div className="relative flex items-center gap-1.5">
            <ActionButton label="Copy verse" onClick={() => shareVerse()}>
              <Copy className="size-3.75" />
            </ActionButton>
            <ActionButton label="Share verse" onClick={shareVerse}>
              <Share2 className="size-3.75" />
            </ActionButton>

            <div
              role="status"
              aria-live="polite"
              className={`pointer-events-none absolute bottom-[calc(100%+8px)] right-0 whitespace-nowrap rounded-md bg-[#201c4f] px-2.5 py-1.5 text-[11.5px] font-semibold text-white transition ${
                toast
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }`}
            >
              {toast ?? ""}
            </div>
          </div>
        </footer>
      </article>
    </section>
  )
}

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void | Promise<void>
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg border border-[#ecdfb4] bg-white text-[#4b4d5c] outline-none transition hover:border-[#26215c] hover:text-[#26215c] focus-visible:ring-2 focus-visible:ring-[#26215c]"
    >
      {children}
    </button>
  )
}
