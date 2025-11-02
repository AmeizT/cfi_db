import React from "react"
import { Form as FormPortal } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UseFormReturn, FieldValues } from "react-hook-form"
import { DialogClose } from "@/components/ui/dialog"

interface FormContainerProps<T extends FieldValues> extends React.AllHTMLAttributes<HTMLFormElement> {
    context: UseFormReturn<T>
    component?: React.JSX.Element
    navigation?: React.JSX.Element
    children: Readonly<React.ReactNode>
    isPending?: boolean
    onClick: () => void
    buttonText?: string
    ref: React.RefObject<HTMLFormElement | null>
    variant?: "dialog" | "drawer"
}

export default function FormContainer<T extends FieldValues>({
    children,
    ref,
    context,
    isPending,
    onClick,
    variant,
    ...props
}: FormContainerProps<T>) {
    return (
        <FormPortal {...context}>
            <form
                ref={ref}
                {...props}
                className="bg-white dark:bg-neutral-900 h-full w-full grow flex flex-col lg:rounded-b-2xl overflow-hidden relative"
            >
                <ScrollArea className="pb-2 flex-1 overflow-y-auto">
                    {children}
                </ScrollArea>

                <footer className="w-full shrink-0 flex justify-end items-center gap-2 bg-slate-50 dark:bg-neutral-800/30 px-6 h-14 rounded-b-2xl border-t border-slate-200 dark:border-neutral-700">
                    {variant === "dialog" ? (
                        <DialogClose asChild>
                            <Button
                                onClick={onClick}
                                type="button"
                                variant="outline"
                                className="px-3 flex w-fit h-8 rounded-lg border-slate-300 dark:border-neutral-600"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                    ) : (
                        <Button
                            onClick={onClick}
                            type="button"
                            variant="outline"
                            className="px-3 flex w-fit h-8 rounded-lg border-slate-300 dark:border-neutral-600"
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        className="w-fit px-3 h-8 flex content-center dark:text-white font-semibold bg-neutral-900 dark:bg-primary rounded-lg"
                        disabled={isPending}
                    >
                        {isPending ? <Text variant="shine">Submitting...</Text> : `Submit`}

                    </Button>
                </footer>
            </form>
        </FormPortal>
    )
}


