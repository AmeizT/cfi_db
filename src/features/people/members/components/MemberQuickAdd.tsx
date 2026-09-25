"use client"

import { UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useController, useFormContext } from "react-hook-form"
import { Field, FormShell } from "@/features/create/forms/FormShell"
import { genders } from "@/features/create/forms/contracts"

// Required relationship arrays remain empty until users opt into the full form.
function MemberQuickAddFields() {
    const { formState } = useFormContext()
    useController({ name: "ministries", defaultValue: [] })
    useController({ name: "positions", defaultValue: [] })
    return <>
        <div className="flex flex-wrap items-start gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-dashed border-primary/40 bg-primary/10 text-primary"><UserPlus className="size-7" aria-hidden="true" /></div>
            <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
                <Field name="first_name" label="First name" required maxLength={100} placeholder="—" />
                <Field name="last_name" label="Last name" required maxLength={100} placeholder="—" />
            </div>
            <Badge variant="secondary">{formState.isSubmitting ? "Saving…" : "Draft"}</Badge>
        </div>
        <div>
            <h2 className="mb-5 text-lg font-semibold">Member information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
                <Field name="phone_number" label="Phone (optional)" type="tel" maxLength={17} placeholder="—" />
                <Field name="date_of_birth" label="Date of birth" type="date" required />
                <Field name="gender" label="Gender" choices={genders} required />
                <Field name="country" label="Country" required placeholder="—" />
            </div>
        </div>
        <p className="text-sm text-muted-foreground">Complete the required fields, then create the member. This draft has not been saved.</p>
    </>
}

export function MemberQuickAdd({ onCancel, onCreated }: { onCancel: () => void; onCreated?: (id: string) => void }) {
    return (
        <FormShell entity="members" title="Member" inline={{ onCancel, onCreated, presentation: "detail", fullFormHref: "/members/directory/new" }}>
            <MemberQuickAddFields />
        </FormShell>
    )
}
