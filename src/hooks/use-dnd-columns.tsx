"use client"

import * as React from "react"
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable"

type UseDnDColumnOrderProps = {
    initialOrder: string[]
}

export function useDnDColumnOrder({ initialOrder }: UseDnDColumnOrderProps) {
    const [order, setOrder] = React.useState<string[]>(initialOrder)

    // sync when backend changes
    React.useEffect(() => {
        setOrder(initialOrder)
    }, [initialOrder])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = order.indexOf(String(active.id))
        const newIndex = order.indexOf(String(over.id))

        setOrder(arrayMove(order, oldIndex, newIndex))
    }

    const DragContext = ({ children }: { children: React.ReactNode }) => (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <SortableContext
                items={order}
                strategy={horizontalListSortingStrategy}
            >
                {children}
            </SortableContext>
        </DndContext>
    )

    return {
        order,
        setOrder,
        DragContext,
    }
}