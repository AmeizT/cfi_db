"use client"

import * as React from "react"
import { PencilIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateHousehold, useUpdateHousehold } from "../../families/hooks"
import type { Household, HouseholdDetail } from "../../families/schema"
import type { HouseholdWriteInput } from "../../families/service"

export function HouseholdFormDialog({ household, triggerVariant = "outline" }: { household?: Household | HouseholdDetail; triggerVariant?: "default" | "outline" }) {
    const [open, setOpen] = React.useState(false)
    const createMutation = useCreateHousehold()
    const updateMutation = useUpdateHousehold()
    const pending = createMutation.isPending || updateMutation.isPending
    const editing = Boolean(household)

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const values: HouseholdWriteInput = {
            name: String(data.get("name") ?? "").trim(),
            phone_number: String(data.get("phone_number") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            address: String(data.get("address") ?? "").trim(),
            city: String(data.get("city") ?? "").trim(),
            country: String(data.get("country") ?? "").trim(),
            notes: String(data.get("notes") ?? "").trim(),
        }
        if (!values.name) return toast.error("Household name is required.")
        const options = {
            onSuccess: () => { toast.success(editing ? "Household updated." : "Household created."); setOpen(false) },
            onError: (error: Error) => toast.error(error.message),
        }
        if (household) updateMutation.mutate({ id: household.id, values }, options)
        else createMutation.mutate(values, options)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" size="sm" variant={triggerVariant}>
                    {editing ? <PencilIcon aria-hidden="true" className="size-4" /> : <PlusIcon aria-hidden="true" className="size-4" />}
                    {editing ? "Edit household" : "Add household"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={submit} className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit household" : "Add household"}</DialogTitle>
                        <DialogDescription>{editing ? "Update shared household contact information." : "Create a household in the active assembly."}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2 sm:col-span-2"><Label htmlFor="household-name">Household name</Label><Input id="household-name" name="name" required defaultValue={household?.name} /></div>
                        <div className="grid gap-2"><Label htmlFor="household-phone">Phone</Label><Input id="household-phone" name="phone_number" defaultValue={household?.phone_number} /></div>
                        <div className="grid gap-2"><Label htmlFor="household-email">Email</Label><Input id="household-email" name="email" type="email" defaultValue={household?.email} /></div>
                        <div className="grid gap-2 sm:col-span-2"><Label htmlFor="household-address">Address</Label><Input id="household-address" name="address" defaultValue={household?.address} /></div>
                        <div className="grid gap-2"><Label htmlFor="household-city">City</Label><Input id="household-city" name="city" defaultValue={household?.city} /></div>
                        <div className="grid gap-2"><Label htmlFor="household-country">Country</Label><Input id="household-country" name="country" defaultValue={household?.country} /></div>
                        <div className="grid gap-2 sm:col-span-2"><Label htmlFor="household-notes">Notes</Label><Textarea id="household-notes" name="notes" defaultValue={household?.notes} /></div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={pending}>{pending ? "Saving…" : editing ? "Save changes" : "Create household"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
