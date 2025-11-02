"use client"

import React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Grid, List, Loader2 } from "lucide-react"

import { useUser } from "@/hooks/query/use-user"
import { useMembers } from "@/hooks/query/use-members"
import { TitheEntryCard } from "../components/TitheEntryCard"
import { paymentMethods } from "../schemas/payment-methods"
import { TitheEntryTable } from "../components/TitheEntryTable"
import { TitheFormData, TitheFormSchema } from "../schemas/tithes"
import { createTithes } from "../actions/create-tithes"
import Container from "@/components/ui/container"
import FormContainer from "@/features/reports/components/FormContainer"

const inititalState = {
    message: "",
    status: -1,
    success: false,
}

export function TitheForm() {
    const { data: user } = useUser()
    const { data: members } = useMembers()
    const ref = React.useRef<HTMLFormElement>(null)
    const [viewMode, setViewMode] = useState<"default" | "table">("default")
    const [isCreated, setIsCreated] = React.useState<boolean>(false)
    // const [showPreview, setShowPreview] = useState(false)
    // const [previewData, setPreviewData] = useState<Tithe[]>([])
    const [state, formAction, isPending] = React.useActionState(createTithes, inititalState)

    const assemblies = user?.assemblies || []

    const form = useForm<TitheFormData>({
        resolver: zodResolver(TitheFormSchema),
        defaultValues: {
            tithes: [
                {
                    assembly: String(user?.church) || "",
                    created_by: String(user?.id) || "",
                    member: "",
                    amount: "",
                    payment_method: "Bank",
                    timestamp: new Date(),
                    reference_code: "",
                    notes: "",
                    receipt: undefined,
                },
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "tithes",
    })

    const addAnotherTithe = () => {
        append({
            assembly: "",
            created_by: String(user?.id) || "",
            member: "",
            amount: "",
            payment_method: "Bank",
            timestamp: new Date(),
            reference_code: "",
            notes: "",
            receipt: undefined,
        })
    }

    const removeTithe = (index: number) => {
        if (fields.length > 1) {
            remove(index)
        }
    }

    async function tithesFormAction(formData: FormData) {
        const data = form.getValues()

        const tithesData = data.tithes.map((tithe) => ({
            assembly: tithe.assembly,
            member: tithe.member || undefined,
            created_by: String(tithe.created_by) || undefined,
            amount: Number(tithe.amount),
            payment_method: tithe.payment_method,
            timestamp: tithe.timestamp.toISOString().split("T")[0],
            reference_code: tithe.reference_code || undefined,
            notes: tithe.notes || undefined,
        }))

        formData.append("data", JSON.stringify({ tithes: tithesData }))

        data.tithes.forEach((tithe) => {
            if (tithe.receipt && tithe.receipt[0]) {
                formData.append(`receipt`, tithe.receipt[0])
            }
        })

        await formAction(formData)
    }

    // const handlePreview = () => {
    //     const formData = form.getValues()
    //     setPreviewData(formData.tithes)
    //     setShowPreview(true)
    // }

    // if (showPreview) {
    //     return (
    //         <TithePreview 
    //             data={previewData} 
    //             onBack={() => setShowPreview(false)} 
    //         />
    //     )
    // }

    React.useEffect(() => {
        if(state.success){
            setIsCreated(true)
            form.reset()
            console.log("Tithes submitted successfully:", state.message)
        } else {
            setIsCreated(false)
        }
    }, [state, form])

    return (
        <React.Fragment>
            {isCreated ? (
                <Container>
                    <Container.Success 
                        label="tithe"
                        redirectPath="/finance/tithes" 
                        onCreateAnother={() => setIsCreated(false)}
                    />
                </Container>
            ) : (
                <FormContainer
                    ref={ref}
                    context={form}
                    action={tithesFormAction}
                    isPending={isPending}
                    onClick={() => form.reset()}
                >
                    <div className="w-full px-4 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                {fields.length > 1 && (
                                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "default" | "table")}>
                                        <TabsList>
                                            <TabsTrigger value="default" className="flex items-center gap-2">
                                                <Grid className="h-4 w-4" />
                                                Cards
                                            </TabsTrigger>
                                            <TabsTrigger value="table" className="flex items-center gap-2">
                                                <List className="h-4 w-4" />
                                                Table
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 overflow-hidden">
                            {viewMode === "default" ? (
                                <div className="grid gap-4 lg:gap-6 overflow-hidden">
                                    {fields.map((field, index) => (
                                        <TitheEntryCard
                                            key={field.id}
                                            index={index}
                                            form={form}
                                            onRemove={() => removeTithe(index)}
                                            canRemove={fields.length > 1}
                                            paymentMethods={[...paymentMethods]}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <TitheEntryTable
                                    fields={fields}
                                    form={form}
                                    onRemove={removeTithe}
                                    assemblies={assemblies}
                                    members={members}
                                    paymentMethods={[...paymentMethods]}
                                />
                            )}

                            <div className="flex items-center justify-between">
                                <Button type="button" variant="outline" onClick={addAnotherTithe} className="flex items-center gap-2 rounded-lg border-gray-300 dark:border-neutral-600 dark:bg-neutral-800">
                                    <Plus className="h-4 w-4" />
                                    Add More
                                </Button>

                                <div className="hidden _flex items-center gap-2">
                                    <Badge>
                                        {fields.length} {fields.length === 1 ? "Entry" : "Entries"}
                                    </Badge>
                                    <Button type="submit" className="min-w-[120px]">
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Tithes"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </FormContainer>
            )}
        </React.Fragment>

    )
}




