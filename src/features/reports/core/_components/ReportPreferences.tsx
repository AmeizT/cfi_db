"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ReportSettingsProps {
    viewMode: "dashboard" | "consolidated"
    navigationMode: "arrows" | "timeline"
    onViewModeChange: (mode: "dashboard" | "consolidated") => void
    onNavigationModeChange: (mode: "arrows" | "timeline") => void
}

export function ReportSettings({
    viewMode,
    navigationMode,
    onViewModeChange,
    onNavigationModeChange,
}: ReportSettingsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-2">
                    <Settings className="h-4 w-4" />
                    <span className="">Configure</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Report Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Display Mode</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={viewMode}
                    onValueChange={(value) => onViewModeChange(value as "dashboard" | "consolidated")}
                >
                    <DropdownMenuRadioItem value="dashboard">Dashboard</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="consolidated">Consolidated</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Navigation Style</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={navigationMode}
                    onValueChange={(value) => onNavigationModeChange(value as "arrows" | "timeline")}
                >
                    <DropdownMenuRadioItem value="arrows">Arrows</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="timeline">Timeline</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
