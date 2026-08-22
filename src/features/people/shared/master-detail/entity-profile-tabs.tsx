"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { EntityTab } from "./entity-master-detail.types"

type EntityProfileTabsProps<TTab extends string> = {
    tabs: Array<EntityTab<TTab>>
    value: TTab
    onValueChange: (value: TTab) => void
}

export function EntityProfileTabs<TTab extends string>({ tabs, value, onValueChange }: EntityProfileTabsProps<TTab>) {
    const visibleTabs = tabs.filter((tab) => tab.visible !== false)
    return (
        <Tabs value={value} onValueChange={(next) => onValueChange(next as TTab)} className="border-b border-border-subtle px-3 pt-2 sm:px-5">
            <TabsList className="h-auto max-w-full justify-start overflow-x-auto bg-transparent p-0">
                {visibleTabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="shrink-0 rounded-none border-b-2 border-transparent px-3 py-2.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}
