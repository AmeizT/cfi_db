import type { ReactNode } from "react"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EntityDetailPanelProps = {
    children: ReactNode
    mobileTitle?: string
    visible: boolean
    onBack: () => void
}

export function EntityDetailPanel({ children, mobileTitle, visible, onBack }: EntityDetailPanelProps) {
    return (
        <section
            aria-label={mobileTitle ? `${mobileTitle} details` : "Selected record details"}
            className={cn(
                "min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-background",
                visible ? "block" : "hidden lg:block",
            )}
        >
            {visible ? (
                <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-border-subtle bg-background/95 px-3 py-2 backdrop-blur lg:hidden">
                    <Button type="button" variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeftIcon aria-hidden="true" className="size-4" />
                        Directory
                    </Button>
                    {mobileTitle ? <span className="min-w-0 truncate text-sm font-medium">{mobileTitle}</span> : null}
                </div>
            ) : null}
            {children}
        </section>
    )
}
