"use client"

import React from "react"
import { Drawer } from "vaul"
import { HugeiconsIcon } from "@hugeicons/react"

import { 
    ArrowDown01Icon,
    Calendar02Icon, 
    HandPrayerIcon, 
    Invoice04Icon, 
    PurseIcon 
} from "@hugeicons/core-free-icons"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { FormController } from "./FormController"
import { Button } from "@/components/ui/button"
import { FormProvider, useFormContext } from "../context/form-context"
import { Spinner } from "@/components/ui/spinner"
import { useReports } from "@/features/reports/core/hooks/use-reports"

const categories = {
    report: [
        { name: "Attendance", icon: Calendar02Icon },
        { name: "Expenses", icon: Invoice04Icon },
        { name: "Income", icon: PurseIcon },
        { name: "Tithes", icon: HandPrayerIcon },
    ],
    entries: [
        { name: "Assets", icon: Invoice04Icon },
        { name: "Groups", icon: Invoice04Icon },
        { name: "Meetings", icon: Calendar02Icon },
        { name: "Member", icon: PurseIcon },
        { name: "Request", icon: HandPrayerIcon },
    ],
}

const forms = {
    assets: {
        title: "Asset",
        description: "Manage church assets by adding, editing, or removing items such as equipment or property.",
    },
    expenses: {
        title: "Expenses",
        description: "Record and categorize church expenses to maintain accurate financial tracking.",
    },
    income: {
        title: "Income",
        description: "Record offerings, donations, and other sources of income received by the church.",
    },
    members: {
        title: "Members",
        description: "Add and update member details to keep your congregation records accurate and up to date.",
    },
    tithes: {
        title: "Tithes",
        description: "Track and record tithes contributed by members for accountability and reporting.",
    },
    "sunday-attendance": {
        title: "Attendance",
        description: "Record attendance for Sunday services to monitor member participation.",
    },
} as const

type FormKey = keyof typeof forms

function EditorDrawerContent() {
    const [form, setForm] = React.useState<string>("attendance")
    const [mode, setMode] = React.useState<"reports" | "entries">("reports")
    const selectedForm = forms[form as FormKey] ?? {}
    const { isPending } = useFormContext()
    const { data } = useReports({year: "2025"})

    console.log("reports data", data)

    const Mode = {
        REPORTS: "reports",
        ENTRIES: "entries",
    } as const

    const items = mode === Mode.REPORTS ? categories.report : categories.entries

    type ModeItem = "reports" | "entries"
    const modeItems: ModeItem[] = ["reports", "entries"]



    return (
        <Drawer.Root direction="right">
            <Drawer.Trigger className="relative flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
                Create
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed z-40 inset-0 bg-black/40" />
                <Drawer.Content className="w-[55%] flex flex-col h-dvh fixed z-50 bottom-0 right-0 outline-none">
                    <Drawer.Title className="sr-only">Editor</Drawer.Title>
                    <div className="w-full h-full rounded-tl-xl rounded-bl-xl flex flex-col flex-1 min-h-0">
                        <SidebarProvider className="min-h-0">
                            <Sidebar collapsible="none" className="hidden h-dvh md:flex rounded-tl-xl rounded-bl-xl bg-white border-r border-slate-200">
                                <SidebarHeader className="h-14 flex justify-center items-center gap-0 border-b">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="w-full">
                                            <button className="px-2 w-full flex justify-between capitalize">
                                                {mode}
                                                <HugeiconsIcon icon={ArrowDown01Icon} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="min-w-60">
                                            {modeItems.map((item) => (
                                                <DropdownMenuItem key={item}>
                                                    <button className="w-full" onClick={() => setMode(item)}>
                                                        {item}
                                                    </button>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarHeader>

                                <SidebarContent>
                                    <SidebarGroup>
                                        <SidebarGroupContent>
                                            <SidebarMenu>
                                                {items.map((item) => (
                                                    <SidebarMenuItem key={item.name}>
                                                        <SidebarMenuButton
                                                            asChild
                                                            isActive={item.name.toLowerCase() === form}
                                                        >
                                                            <Button variant="outline" className="px-3 min-h-11 flex justify-start rounded-xl shadow-none border-0 hover:scale-[1] hover:bg-slate-50" onClick={() => setForm(item.name.toLowerCase())}>
                                                                {/* <HugeiconsIcon 
                                                                    strokeWidth={2.2} 
                                                                    icon={item.icon}
                                                                /> */}
                                                                <span>{item.name}</span>
                                                            </Button>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                ))}
                                            </SidebarMenu>
                                        </SidebarGroupContent>
                                    </SidebarGroup>
                                </SidebarContent>

                                <React.Activity mode={mode?.includes("report") ? "visible" : "hidden"}>
                                    <SidebarFooter>
                                        footer progress bar
                                    </SidebarFooter>
                                </React.Activity>
                            </Sidebar>

                            <main className="flex flex-1 min-h-0 flex-col overflow-y-auto bg-slate-50">
                                <header className="flex h-14 shrink-0 items-center gap-2 px-8 border-b-0 border-border">
                                    <h5 className="text-xl font-bold">
                                        Create {selectedForm.title}
                                    </h5>
                                </header>

                                <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-8 pt-2">
                                    {/* <FormController form={form} report={data?.[0] || null} /> */}
                                </div>

                                <footer className="px-6 h-16 flex justify-end items-center border-t border-slate-200">
                                    <Button className="px-4 min-h-10 rounded-xl relative" type="submit" form="subscription-form">
                                        {isPending ? "Submitting..." : "Submit Draft"}

                                        {isPending ? (
                                            <span className="h-6 w-6 flex justify-center items-center absolute -right-2 top-0 -translate-y-1/2 bg-slate-800 rounded-full border-slate-50 border">
                                                <Spinner className="h-[6%] w-[16%] bg-white" />
                                            </span>
                                        ) : null}
                                    </Button>
                                </footer>
                            </main>
                        </SidebarProvider>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}

export function EditorDrawer() {
    return (
        <FormProvider>
            <EditorDrawerContent />
        </FormProvider>
    )
}
