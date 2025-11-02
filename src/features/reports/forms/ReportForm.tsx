"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { zodResolver } from "@hookform/resolvers/zod"
import { startOfMonth, endOfMonth, format } from "date-fns"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { reportFormSchema, ReportFormValues } from "../schemas/form"
import { createReport, ReportFormState } from "../actions/create-report"
import { useUser } from "@/hooks/query/use-user"
import { HiCalendarDays } from "react-icons/hi2"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { toast } from "sonner"
import FormContainer from "../components/FormContainer"

const initialState: ReportFormState = {
    message: "",
    status: -1,
    success: false,
    errors: {}
}

export function CreateReportForm() {
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
    const formRef = React.useRef<HTMLFormElement>(null)
    const [formState, formAction, isPending] = React.useActionState(
        createReport as unknown as (
            state: ReportFormState
        ) => Promise<ReportFormState>,
        initialState
    )

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportFormSchema),
        defaultValues: {
            church: String(user?.church),
            period_start: "",
            period_end: "",
            status: "draft",
        },
    })

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return

        const start = startOfMonth(date)
        const end = endOfMonth(date)

        setSelectedDate(date)

        form.setValue("period_start", format(start, "yyyy-MM-dd"));
        form.setValue("period_end", format(end, "yyyy-MM-dd"));
    }

    React.useEffect(() => {
        if (![200, 201].includes(formState.status)) return

        queryClient.invalidateQueries({ queryKey: ["reports"] })
        toast(formState.message || "Report created", {
            action: (
                <Link
                    href="/reports/overview"
                    className="px-2 py-1.5 rounded-md hover:bg-primary/10 text-primary font-semibold text-sm"
                >
                    View reports
                </Link>
            ),
        })
    }, [formState.message, formState.status, queryClient])

    React.useEffect(() => {
        if(formState){
            console.log(formState)
        }
    }, [formState])

    return (
        <FormContainer 
            ref={formRef}
            context={form} 
            action={formAction}
            onSubmit={(event) => {
                event.preventDefault()
                React.startTransition(() => {
                    (formAction as unknown as (formData: FormData) => void)(
                        new FormData(formRef.current!)
                    )
                })
            }} 
            isPending={isPending} 
            onClick={() => form.reset()}
            variant="dialog"
            >
            <div className="space-y-6 px-4">
                <div className="hidden">
                    <input type="hidden" {...form.register("period_start")} />
                    <input type="hidden" {...form.register("period_end")} />
                    <input type="hidden" {...form.register("church")} />
                    <input type="text" {...form.register("status")} />
                </div>
                <FormField
                    control={form.control}
                    name="period_start"
                    render={() => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="hidden">Select Report Month</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full rounded-[10px] py-2 has-[>svg]:px-3 text-left font-normal hover:scale-[1]",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                        >
                                            {selectedDate ? (
                                                format(selectedDate, "MMMM yyyy")
                                            ) : (
                                                <span>Report date</span>
                                            )}
                                            <HiCalendarDays className="ml-auto size-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate || undefined}
                                        onSelect={handleDateSelect}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Select any date in the month you want to create a report for. The
                                report will cover the entire month.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {selectedDate && (
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <h4 className="text-sm font-medium mb-2">Report Period</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                                <span className="font-medium">Start:</span>{" "}
                                {format(startOfMonth(selectedDate), "MMMM dd, yyyy")}
                            </p>
                            <p>
                                <span className="font-medium">End:</span>{" "}
                                {format(endOfMonth(selectedDate), "MMMM dd, yyyy")}
                            </p>
                            <p className="text-xs mt-2 text-muted-foreground">
                                Status: Draft • Will be finalized after adding required data
                            </p>
                        </div>
                    </div>
                )}

                {/* <Button type="submit" className="w-full" disabled={!selectedDate}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Creating Report..." : "Create Report"}
                </Button> */}
            </div>
        </FormContainer>
    )
}