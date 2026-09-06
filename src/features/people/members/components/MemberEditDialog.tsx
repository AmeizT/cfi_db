"use client"

import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { MemberUpdateSchema, type Member, type MemberUpdate } from "../schemas/member"
import { updateMemberDetail } from "../services/get-members-directory"

type Props = {
    member: Member | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

function valuesFromMember(member: Member): MemberUpdate {
    return {
        first_name: member.first_name,
        middle_name: member.middle_name ?? "",
        maiden_name: member.maiden_name ?? "",
        last_name: member.last_name,
        date_of_birth: member.date_of_birth,
        gender: member.gender,
        phone_number: member.phone_number ?? "",
        secondary_phone_number: member.secondary_phone_number ?? "",
        email: member.email ?? "",
        address: member.address ?? "",
        city: member.city ?? "",
        province: member.province ?? "",
        country: member.country,
        membership_status: member.membership_status ?? "",
        relationship: member.relationship ?? "",
        occupation: member.occupation ?? "",
        employer: member.employer ?? "",
        notes: member.notes ?? "",
    }
}

export function MemberEditDialog({ member, open, onOpenChange }: Props) {
    const queryClient = useQueryClient()
    const [values, setValues] = React.useState<MemberUpdate | null>(member ? valuesFromMember(member) : null)
    const [formError, setFormError] = React.useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: (payload: MemberUpdate) => updateMemberDetail(member!.member_key, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["assembly"] })
            toast.success("Member updated")
            onOpenChange(false)
        },
        onError: (error) => setFormError(error instanceof Error ? error.message : "Member could not be updated."),
    })

    if (!member || !values) return null

    function update<K extends keyof MemberUpdate>(field: K, value: MemberUpdate[K]) {
        setValues((current) => current ? { ...current, [field]: value } : current)
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setFormError(null)
        const parsed = MemberUpdateSchema.safeParse(values)
        if (!parsed.success) {
            setFormError(parsed.error.issues[0]?.message ?? "Check the highlighted member details.")
            return
        }
        mutation.mutate(parsed.data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <form onSubmit={submit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>Edit member</DialogTitle>
                        <DialogDescription>Update the member-owned profile details below.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="First name" required><Input value={values.first_name} onChange={(event) => update("first_name", event.target.value)} required /></Field>
                        <Field label="Last name" required><Input value={values.last_name} onChange={(event) => update("last_name", event.target.value)} required /></Field>
                        <Field label="Middle name"><Input value={values.middle_name ?? ""} onChange={(event) => update("middle_name", event.target.value)} /></Field>
                        <Field label="Maiden name"><Input value={values.maiden_name ?? ""} onChange={(event) => update("maiden_name", event.target.value)} /></Field>
                        <Field label="Date of birth" required><Input type="date" value={values.date_of_birth} onChange={(event) => update("date_of_birth", event.target.value)} required /></Field>
                        <Field label="Gender" required>
                            <NativeSelect value={values.gender} onChange={(event) => update("gender", event.target.value as MemberUpdate["gender"])} required>
                                <NativeSelectOption value="Male">Male</NativeSelectOption>
                                <NativeSelectOption value="Female">Female</NativeSelectOption>
                            </NativeSelect>
                        </Field>
                        <Field label="Phone"><Input type="tel" value={values.phone_number ?? ""} onChange={(event) => update("phone_number", event.target.value)} /></Field>
                        <Field label="Secondary phone"><Input type="tel" value={values.secondary_phone_number ?? ""} onChange={(event) => update("secondary_phone_number", event.target.value)} /></Field>
                        <Field label="Email"><Input type="email" value={values.email ?? ""} onChange={(event) => update("email", event.target.value)} /></Field>
                        <Field label="Membership status"><Input value={values.membership_status ?? ""} onChange={(event) => update("membership_status", event.target.value)} /></Field>
                        <Field label="Relationship"><Input value={values.relationship ?? ""} onChange={(event) => update("relationship", event.target.value)} /></Field>
                        <Field label="Occupation"><Input value={values.occupation ?? ""} onChange={(event) => update("occupation", event.target.value)} /></Field>
                        <Field label="Employer"><Input value={values.employer ?? ""} onChange={(event) => update("employer", event.target.value)} /></Field>
                        <Field label="Country" required><Input value={values.country} onChange={(event) => update("country", event.target.value)} required /></Field>
                        <Field label="Address" className="sm:col-span-2"><Input value={values.address ?? ""} onChange={(event) => update("address", event.target.value)} /></Field>
                        <Field label="City"><Input value={values.city ?? ""} onChange={(event) => update("city", event.target.value)} /></Field>
                        <Field label="Province"><Input value={values.province ?? ""} onChange={(event) => update("province", event.target.value)} /></Field>
                        <Field label="Notes" className="sm:col-span-2"><Textarea value={values.notes ?? ""} onChange={(event) => update("notes", event.target.value)} rows={4} /></Field>
                    </div>

                    {formError ? <p role="alert" className="text-sm text-destructive">{formError}</p> : null}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>Cancel</Button>
                        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving…" : "Save changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
    return (
        <div className={className}>
            <Label className="mb-2 block">{label}{required ? <span aria-hidden="true"> *</span> : null}</Label>
            {children}
        </div>
    )
}
