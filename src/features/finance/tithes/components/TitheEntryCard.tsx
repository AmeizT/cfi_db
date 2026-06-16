/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { PaymentMethodOption } from "../schemas/payment-methods"
import { useMembers } from "@/hooks/query/use-members"
import { useUser } from "@/hooks/query/use-user"
import { IconTrash } from "@tabler/icons-react"
import { Member } from "@/features/people/schemas/member"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(32, "Bug title must be at most 32 characters."),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
})

export function TitheEntryCard({
    index,
    form,
    onRemove,
    canRemove,
    paymentMethods,
}: {
    index: number
    form: any
    onRemove: () => void
    canRemove: boolean
    paymentMethods: PaymentMethodOption[]
}) {
    const { data: user } = useUser()
    const { data: members } = useMembers()
    const [receiptPreview, setReceiptPreview] = React.useState<string | null>(null)

    const assemblies = user?.assemblies || []
    const hasManyAssemblies = (user?.assemblies?.length ?? 0) > 1

    const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
            if (!allowedTypes.includes(file.type)) {
                alert("Only JPG, JPEG, PNG, and WEBP files are allowed")
                e.target.value = ""
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                setReceiptPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setReceiptPreview(null)
        }
    }

    

    const myform = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })

    return (
        <Card className="p-4 rounded-xl shadow-none border-none bg-gray-100">
            <CardHeader className="px-0 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">Tithe Entry {index + 1}</CardTitle>
                {canRemove && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="px-0! text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <IconTrash className="size-6 lg:size-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldGroup className="space-y-2">
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Bug Title
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Login button not working on mobile"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Label htmlFor={`assembly-${index}`}>Assembly *</Label>
                        {hasManyAssemblies ? 
                            <Select
                                name="assembly"
                                value={form.watch(`tithes.${index}.assembly`)}
                                onValueChange={(value) => form.setValue(`tithes.${index}.assembly`, value)}
                            >
                                <SelectTrigger className="w-full lg:w-fit rounded-lg bg-white border-gray-300 dark:border-neutral-600">
                                    <SelectValue placeholder="Select Assembly" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assemblies.map((assembly) => (
                                        <SelectItem key={assembly.id} value={String(assembly.id)}>
                                            {assembly.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select> :
                        <div className="hidden">
                            <Input
                                id={`assembly-${index}`}
                                type="assembly"
                                {...form.register(`tithes.${index}.assembly`)}
                            />
                        </div>
                        }
                        {form.formState.errors.tithes?.[index]?.assembly && (
                            <p className="text-sm text-red-600">{form.formState.errors.tithes[index].assembly?.message}</p>
                        )}
                    </FieldGroup>

                    <div className="space-y-2">
                        <Label htmlFor={`member-${index}`}>Member</Label>

                        <Select
                            name="member"
                            value={form.watch(`tithes.${index}.member`)}
                            onValueChange={(value) => form.setValue(`tithes.${index}.member`, value)}
                        >
                            <SelectTrigger className="w-full lg:w-fit rounded-lg bg-white border-gray-300 dark:border-neutral-600">
                                <SelectValue placeholder="Select Member (Optional)" />
                            </SelectTrigger>

                            <SelectContent className="bg-white">
                                {members?.map((member: Member) => (
                                    <SelectItem key={member.id} value={String(member?.id)}>
                                        {member.first_name} {member.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`amount-${index}`}>Amount *</Label>
                        <div className="relative">
                            <span className="hidden absolute left-3 top-2.5 text-muted-foreground">$</span>
                            <Input
                                id={`amount-${index}`}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                onFocus={(e) => {
                                    if (e.target.matches(':focus-visible') === false) {
                                        e.target.blur();
                                    }
                                }}
                                className="rounded-lg bg-white border-gray-300 dark:border-neutral-600"
                                {...form.register(`tithes.${index}.amount`)}
                            />
                        </div>
                        {form.formState.errors.tithes?.[index]?.amount && (
                            <p className="text-sm text-red-600">{form.formState.errors.tithes[index].amount?.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`payment-method-${index}`}>Payment Method *</Label>
                        <Select
                            name="payment_method"
                            value={form.watch(`tithes.${index}.payment_method`)}
                            onValueChange={(value) => form.setValue(`tithes.${index}.payment_method`, value)}
                        >
                            <SelectTrigger className="w-full lg:w-fit rounded-lg bg-white border-gray-300 dark:border-neutral-600">
                                <SelectValue placeholder="Select Payment Method" />
                            </SelectTrigger>

                            <SelectContent>
                                {paymentMethods.map((method) => (
                                    <SelectItem key={method.value} value={method.value}>
                                        {method.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`timestamp-${index}`}>Date *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !form.watch(`tithes.${index}.timestamp`) && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.watch(`tithes.${index}.timestamp`) ? (
                                        format(form.watch(`tithes.${index}.timestamp`), "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={form.watch(`tithes.${index}.timestamp`)}
                                    onSelect={(date) => form.setValue(`tithes.${index}.timestamp`, date || new Date())}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2 hidden">
                        <Label htmlFor={`reference-code-${index}`}>Reference Code</Label>
                        <Input
                            id={`reference-code-${index}`}
                            placeholder="TH-YYYY-MM-DD-XXX"
                            {...form.register(`tithes.${index}.reference_code`)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`receipt-${index}`}>Receipt (Images only)</Label>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Input
                                id={`receipt-${index}`}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                {...form.register(`tithes.${index}.receipt`)}
                                onChange={handleReceiptChange}
                                className="rounded-lg bg-white border-gray-300 dark:border-neutral-600"
                            />
                        </div>
                        {receiptPreview && (
                            <div className="w-16 h-16 border rounded-md overflow-hidden">
                                <Image
                                    src={receiptPreview || "/placeholder.svg"}
                                    alt="Receipt preview"
                                    className="w-full h-full object-cover"
                                    height={64}
                                    width={64}
                                />
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">Supported formats: JPG, JPEG, PNG, WEBP (Max 5MB)</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`notes-${index}`}>Notes</Label>
                    <Textarea
                        id={`notes-${index}`}
                        placeholder="Add any additional notes..."
                        {...form.register(`tithes.${index}.notes`)}
                        className="bg-white rounded-lg border-gray-300 dark:border-neutral-600"
                    />
                </div>
            </CardContent>
        </Card>
    )
}