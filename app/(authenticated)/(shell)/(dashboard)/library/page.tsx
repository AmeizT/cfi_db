import { cookies } from "next/headers"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { withJwt } from "@/config/headers"
import { url } from "@/config/urls"
import { ResourcesListResponse } from "@/dal/schemas/resources"

export default async function LibraryPage({ searchParams }: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams
    const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1)
    const token = (await cookies()).get("accessToken")?.value
    let items: ReturnType<typeof ResourcesListResponse.parse> = []
    let hasNext = false
    let failed = false

    try {
        const response = await fetch(`${url.resources}?page=${page}`, {
            ...withJwt(token), cache: "no-store",
        })
        if (!response.ok) throw new Error("Unable to load library")
        const data = await response.json()
        items = ResourcesListResponse.parse(Array.isArray(data) ? data : data.results)
        hasNext = !Array.isArray(data) && Boolean(data.next)
    } catch {
        failed = true
    }

    return (
        <div className="flex min-h-96 flex-col gap-6 p-6 text-foreground">
            <h1 className="text-2xl font-semibold">Library</h1>
            {failed ? (
                <p role="alert" className="text-muted-foreground">Unable to load library items. Please refresh to try again.</p>
            ) : items.length === 0 ? (
                <EmptyState type="reports" variant="heading"
                    title="No library items yet"
                    description="Books, documents, and other library resources will appear here once they are added."
                    icon={<BookOpen className="size-12 text-muted-foreground" />}
                    className="min-h-80" />
            ) : (
                <ul className="divide-y divide-border">
                    {items.map((item) => (
                        <li key={item.id} className="space-y-1 py-4">
                            {item.file && /^https?:\/\//i.test(item.file) ? (
                                <a href={item.file} className="font-medium hover:underline">{item.title}</a>
                            ) : <span className="font-medium">{item.title}</span>}
                            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        </li>
                    ))}
                </ul>
            )}
            {!failed && (page > 1 || hasNext) && (
                <nav aria-label="Library pagination" className="flex gap-4 text-sm">
                    {page > 1 && <Link href={`/library?page=${page - 1}`}>Previous</Link>}
                    {hasNext && <Link href={`/library?page=${page + 1}`}>Next</Link>}
                </nav>
            )}
        </div>
    )
}
