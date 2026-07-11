"use client"

import * as React from "react"
import { toast } from "sonner"
import { titheSchema } from "../schemas/tithes"
import { useAppForm } from "@/features/editor/hooks/use-form"
import { useUser } from "@/hooks/query/use-user"
import { useMembers } from "@/hooks/query/use-members"
import { Member } from "@/features/people/schemas/member"
import { createTithes } from "../actions/create-tithes"
import { paymentMethods } from "../schemas/payment-methods"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { SelectItem } from "@/components/ui/select"
import { formatCurrency } from "@/utils"
import { MonthlyReport } from "@/features/reports/core/schemas/report"
import { useFormContext } from "@/features/editor/context/form-context"

const inititalState = {
    message: "",
    status: -1,
    success: false,
}

interface TitheFormProps {
    formId: string
    report: MonthlyReport | null
}

export function TitheFormUpdated({ formId, report }: TitheFormProps) {
    const { data: user } = useUser()
    const { data: members } = useMembers()
    const { setIsPending } = useFormContext()
    const [state, formAction, isPending] = React.useActionState(createTithes, inititalState)
    const assembly = user?.assemblies?.find(assembly => assembly.id === user.church)

    React.useEffect(() => {
        setIsPending(isPending)
    }, [isPending, setIsPending])

    const form = useAppForm({
        defaultValues: {
            report: String(report?.id) || "",
            assembly: String(user?.church),
            created_by: String(user?.id),
            member: "",
            amount: "",
            payment_method: "Bank",
            timestamp: "",
            reference_code: "",
            notes: "",
            receipt: "",
        },
        validators: {
            onSubmit: titheSchema,
        },
        onSubmit: async ({ value }) => {
            const data = value
            const formData = new FormData()

            const tithesData = [
                {
                    report: data.report, 
                    assembly: data.assembly,
                    member: data.member || undefined,
                    created_by: data.created_by || undefined,
                    amount: Number(data.amount),
                    payment_method: data.payment_method,
                    timestamp: data.timestamp,
                    reference_code: data.reference_code || undefined,
                    notes: data.notes || undefined,
                }
            ]

            formData.append("data", JSON.stringify({ tithes: tithesData }))

            if (value.receipt && value.receipt[0]) {
                formData.append("receipt_0", value.receipt[0])
            }

            React.startTransition(() => formAction(formData))
            
            toast("You submitted the following values:", {
                description: (
                    <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                        <code>{JSON.stringify(value, null, 2)}</code>
                    </pre>
                ),
                position: "bottom-right",
                classNames: {
                    content: "flex flex-col gap-2",
                },
                style: {
                    "--border-radius": "calc(var(--radius)  + 4px)",
                } as React.CSSProperties,
            })
        },
    })

    React.useEffect(() => {
        if(state.success){
            form.reset()
            console.log("Tithes submitted successfully:", state.message)
        } else {
            console.log("Tithes submission failed", state.message) 
        }
    }, [form, state])

    return (
        <div>
            <form
                id={formId}
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <FieldGroup>
                    <FieldSet>
                        <div className="flex gap-4">
                            <form.AppField name="member">
                                {field => (
                                    <field.Select 
                                        label="Member" 
                                        hasTip
                                        tip="Select the member making the contribution. If left blank, the tithe will be recorded as from an anonymous giver."
                                    >
                                        {members?.map((member: Member) => (
                                            <SelectItem key={member?.id} value={String(member.id)}>
                                                {member?.first_name} {member?.last_name}
                                            </SelectItem>
                                        ))}
                                    </field.Select>
                                )}
                            </form.AppField>

                            <form.AppField name="timestamp">
                                {field => (
                                    <field.Input
                                        type="date"
                                        placeholder=""
                                        label="Payment Date"
                                        isRequired={true}
                                        onPointerDown={(e) => e.stopPropagation()}
                                    />
                                )}
                            </form.AppField>
                        </div>
                    </FieldSet>

                    <div className="flex gap-4">
                        <form.AppField name="amount">
                            {field => (
                                <field.Input
                                    type="number"
                                    placeholder={formatCurrency(0, {
                                        language: assembly?.locale ?? assembly?.language ?? "en-US",
                                        currency: assembly?.currency || "USD",
                                        notation: "compact",
                                        compactDisplay: "short",
                                    })}
                                    label="Contribution Amount"
                                    isRequired
                                />
                            )}
                        </form.AppField>

                        <form.AppField name="payment_method">
                            {field => (
                                <field.Select label="Payment Method" isRequired={true}>
                                    {paymentMethods.map((method) => (
                                        <SelectItem key={method.value} value={method.value}>
                                            {method.label}
                                        </SelectItem>
                                    ))}
                                </field.Select>
                            )}
                        </form.AppField>
                    </div>

                    <form.AppField name="reference_code">
                        {field => (
                            <field.Input
                                type="string"
                                placeholder="TXN123456"
                                label="Reference"
                                description="Add a transaction ID or deposit number for record keeping"
                                
                                tip="Include a reference code such as a transaction ID or deposit number to help with record keeping and future reference."
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="notes">
                        {field => (
                            <field.Textarea
                                type="string"
                                placeholder=""
                                label="Notes"
                                description="Add any relevant details, special circumstances, or context"
                            />
                        )}
                    </form.AppField>
                </FieldGroup>
            </form>
        </div>
    )
}
