import type { CSSProperties, ReactNode } from "react"

export type SwipeAction = {
    id: string
    label: string
    icon?: ReactNode
    dismiss?: boolean
    color?: string
    onSelect?: () => void
}
export default function SwipeRow(props: {
    children: ReactNode
    actions?: SwipeAction[]
    actionColor?: string
    drawerColor?: string
    rowColor?: string
    textColor?: string
    height?: number
    radius?: number
    actionWidth?: number
    direction?: "left" | "right"
    snapBounce?: number
    resistance?: number
    collapseMs?: number
    commitAt?: number
    fullSwipe?: boolean
    disabled?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onAction?: (action: SwipeAction) => void
    onCommit?: (action: SwipeAction) => void
    closeOnAction?: boolean
    haptic?: boolean
    label?: string
    className?: string
    style?: CSSProperties & Record<`--${string}`, string | number>
}): ReactNode
