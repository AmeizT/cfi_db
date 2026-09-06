import { redirect } from "next/navigation"

export default async function LegacyJethroPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; conversation?: string }>
}) {
    const { q, conversation } = await searchParams
    const params = new URLSearchParams()
    if (q) params.set("prompt", q)
    if (conversation) params.set("conversation", conversation)
    redirect(params.size ? `/ai?${params.toString()}` : "/ai")
}
