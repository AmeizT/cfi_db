"use client"

import React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import type { AssemblySummary } from "@/features/auth/schemas/user"
import { getAssemblyThemeColor } from "@/features/appearance/lib/assembly-theme"
import { applySidebarForeground } from "@/features/appearance/lib/sidebar-foreground"
import styles from "./AssemblyCardDeck.module.css"

interface Props {
    assemblies: AssemblySummary[]
    activeAssembly?: AssemblySummary | null
    loading: boolean
    pending: boolean
    variant: "default" | "sidebar"
    onSelect: (assembly: AssemblySummary) => void
}

export function AssemblyCardDeck({ assemblies, activeAssembly, loading, pending, variant, onSelect }: Props) {
    const root = React.useRef<HTMLDivElement>(null)
    const deck = React.useRef<HTMLDivElement>(null)
    const trigger = React.useRef<HTMLButtonElement>(null)
    const [expanded, setExpanded] = React.useState(false)
    const [pinned, setPinned] = React.useState(false)
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const isMobile = useIsMobile()
    const chooserId = React.useId()
    const multiple = assemblies.length > 1
    const Card = multiple ? "button" : "div"
    const ordered = activeAssembly
        ? [activeAssembly, ...assemblies.filter(a => String(a.id) !== String(activeAssembly.id))]
        : assemblies

    function collapse(restoreFocus = false) {
        setExpanded(false)
        setPinned(false)
        if (deck.current) deck.current.scrollLeft = 0
        if (restoreFocus) trigger.current?.focus()
    }

    function expand(pin = false, touch = false) {
        if (!multiple || loading || pending) return
        if (isMobile || touch) {
            setMobileOpen(true)
            return
        }
        setExpanded(true)
        if (pin) setPinned(true)
    }

    React.useEffect(() => {
        if (!expanded) return
        function outside(event: PointerEvent) {
            if (!root.current?.contains(event.target as Node)) {
                setExpanded(false)
                setPinned(false)
                if (deck.current) deck.current.scrollLeft = 0
            }
        }
        function escape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setExpanded(false)
                setPinned(false)
                if (deck.current) deck.current.scrollLeft = 0
                trigger.current?.focus()
            }
        }
        function reposition() {
            setExpanded(false)
            setPinned(false)
        }
        document.addEventListener("pointerdown", outside)
        document.addEventListener("keydown", escape)
        window.addEventListener("resize", reposition)
        return () => {
            document.removeEventListener("pointerdown", outside)
            document.removeEventListener("keydown", escape)
            window.removeEventListener("resize", reposition)
        }
    }, [expanded])

    function select(assembly: AssemblySummary) {
        if (pending) return
        collapse(true)
        setMobileOpen(false)
        onSelect(assembly)
    }

    return (
        <div ref={root} className={styles.root} aria-label={`Current assembly: ${activeAssembly?.name ?? "None"}`} data-variant={variant} data-expanded={expanded} data-multiple={multiple}
            onPointerEnter={event => { if (event.pointerType === "mouse" && !isMobile) expand() }}
            onPointerLeave={() => { if (!pinned) collapse() }}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) collapse() }}>
            <div ref={deck} id={chooserId} className={styles.deck} data-expanded={expanded}
                role={expanded ? "group" : undefined} aria-label={expanded ? "Choose assembly" : undefined}>
                <div className={styles.track}>
                    {ordered.map((assembly, index) => (
                        <Tooltip key={assembly.id} delayDuration={250}>
                            <TooltipTrigger asChild>
                            <Card type={multiple ? "button" : undefined} className={styles.card}
                                style={{ "--index": index, "--peek": Math.min(index, 3), "--tilt": `${[0, -1.5, 1, -0.75][Math.min(index, 3)]}deg` } as React.CSSProperties}
                                data-active={index === 0} data-hidden={!expanded && index > 3}
                                tabIndex={multiple ? (expanded ? 0 : -1) : undefined} disabled={multiple ? pending : undefined}
                                aria-hidden={!expanded} aria-label={`${index === 0 ? "Current assembly:" : "Switch to"} ${assembly.name}${index === 0 ? "" : " assembly"}`}
                                aria-current={index === 0 ? "true" : undefined}
                                onClick={() => { if (index === 0 && !pinned) expand(true); else select(assembly) }}>
                                <AssemblyArtwork assembly={assembly} />
                            </Card>
                            </TooltipTrigger>
                            {expanded && <TooltipContent side="bottom" sideOffset={6}>{assembly.name}</TooltipContent>}
                        </Tooltip>
                    ))}
                    {loading && <div className={styles.loading} />}
                </div>
            </div>
            <span className={styles.name}><span className={styles.nameText}>{loading ? "Loading…" : activeAssembly?.name ?? "No assembly"}</span></span>
            {multiple && <button ref={trigger} type="button" className={styles.trigger}
                aria-label={`Switch assembly. Current assembly: ${activeAssembly?.name ?? "None"}`}
                aria-expanded={expanded || mobileOpen} aria-haspopup={isMobile || mobileOpen ? "dialog" : undefined} aria-controls={isMobile || mobileOpen ? `${chooserId}-mobile` : chooserId} aria-busy={loading || pending}
                disabled={loading || pending} tabIndex={expanded ? -1 : 0}
                onClick={event => expand(true, (event?.nativeEvent as PointerEvent | undefined)?.pointerType === "touch")}
                onKeyDown={event => {
                    if (["Enter", " ", "ArrowRight", "ArrowDown"].includes(event.key)) {
                        event.preventDefault()
                        expand(true)
                        if (!isMobile) requestAnimationFrame(() => deck.current?.querySelector<HTMLButtonElement>("button")?.focus())
                    }
                }} />}
            {multiple && <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
                <DialogContent id={`${chooserId}-mobile`} className="max-w-sm rounded-2xl"
                    onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus() }}>
                    <DialogTitle>Choose assembly</DialogTitle>
                    <DialogDescription className="sr-only">Select the assembly you want to manage.</DialogDescription>
                    <div className={styles.mobileGrid}>
                        {ordered.map((assembly, index) => (
                            <button key={assembly.id} type="button" className={styles.mobileItem}
                                disabled={pending} aria-label={`${index === 0 ? "Current assembly:" : "Switch to"} ${assembly.name}${index === 0 ? "" : " assembly"}`}
                                aria-current={index === 0 ? "true" : undefined}
                                onClick={() => select(assembly)}>
                                <span className={styles.mobileCard} data-active={index === 0}>
                                    <AssemblyArtwork assembly={assembly} />
                                </span>
                                <span className={styles.mobileName}>{assembly.name}</span>
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>}
        </div>
    )
}

function AssemblyArtwork({ assembly }: { assembly: AssemblySummary }) {
    const color = getAssemblyThemeColor(assembly)
    return <span className={styles.artwork}
        ref={node => { if (node && color) applySidebarForeground(node, color) }}
        style={color ? { background: color } : undefined}
        aria-hidden="true">
        {assembly.name?.charAt(0).toUpperCase() || "A"}
    </span>
}
