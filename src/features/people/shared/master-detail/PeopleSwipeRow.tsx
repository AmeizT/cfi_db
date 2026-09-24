"use client"

import { useState, type ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, UserSwitchIcon } from "@hugeicons/core-free-icons"
import SwipeRow from "@/components/SwipeRow"

/** Keep confirmation, errors and mutations owned by the existing row handlers. */
export function PeopleSwipeRow({ children, label, onDelete, onTransfer, pending = false }: {
    children: ReactNode
    label: string
    onDelete: () => void
    onTransfer: () => void
    pending?: boolean
}) {
    const [revision, setRevision] = useState(0)
    return <SwipeRow key={revision} label={label} radius={0}
        rowColor="var(--background)" textColor="var(--foreground)"
        className="[&>.swipe-row__clip>.swipe-row__surface]:block [&>.swipe-row__clip>.swipe-row__surface]:p-0"
        style={{ "--sr-h": "auto" }}
        actions={pending ? [] : [
            { id: "delete", label: "Delete", icon: <HugeiconsIcon icon={Delete02Icon} size={20} />, dismiss: true },
            { id: "transfer", label: "Transfer", icon: <HugeiconsIcon icon={UserSwitchIcon} size={20} /> },
        ]}
        onAction={(action: { id: string }) => { if (!pending && action.id === "transfer") onTransfer() }}
        onCommit={() => {
            // SwipeRow has collapsed. Restore it while confirmation/API work runs,
            // including cancellation or failure; successful mutations remove it.
            setRevision(value => value + 1)
            if (!pending) onDelete()
        }}
    >{children}</SwipeRow>
}
