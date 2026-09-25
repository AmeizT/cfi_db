"use client"

import { HousePlus } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Field, FormShell } from "@/features/create/forms/FormShell"

function HouseholdDraftFields() {
    const { formState } = useFormContext()
    return <>
        <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-dashed border-primary/40 bg-primary/10 text-primary"><HousePlus className="size-7" aria-hidden="true" /></div>
            <h2 className="flex-1 text-2xl font-semibold">New household</h2>
            <Badge variant="secondary">{formState.isSubmitting ? "Saving…" : "Draft"}</Badge>
        </div>
        <div>
            <h3 className="mb-5 text-lg font-semibold">Household information</h3>
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field name="name" label="Household name" required placeholder="—" /></div>
                <Field name="phone_number" label="Phone" type="tel" maxLength={17} placeholder="—" />
                <Field name="email" label="Email" type="email" maxLength={254} placeholder="—" />
                <div className="sm:col-span-2"><Field name="address" label="Address" placeholder="—" /></div>
            </div>
        </div>
        <p className="text-sm text-muted-foreground">Enter a household name, then create the household. Manage its members from the saved household profile. This draft has not been saved.</p>
    </>
}

export function HouseholdQuickAdd({ onCancel, onCreated }: { onCancel: () => void; onCreated: (id: string) => void }) {
    return <FormShell entity="households" title="Household" inline={{ onCancel, onCreated, presentation: "detail", fullFormHref: "/members/households/new" }}>
        <HouseholdDraftFields />
    </FormShell>
}
