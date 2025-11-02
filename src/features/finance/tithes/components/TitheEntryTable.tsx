/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Trash2 } from "lucide-react"
import { PaymentMethodOption } from "../schemas/payment-methods"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Member } from "@/features/people/schemas/member"

export function TitheEntryTable({
    fields,
    form,
    onRemove,
    assemblies,
    members,
    paymentMethods,
}: {
    fields: any[]
    form: any
    onRemove: (index: number) => void
    assemblies: any[]
    members: Member[]
    paymentMethods: PaymentMethodOption[]
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tithe Entries - Table View</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2 font-medium">#</th>
                                <th className="text-left p-2 font-medium">Assembly *</th>
                                <th className="text-left p-2 font-medium">Member</th>
                                <th className="text-left p-2 font-medium">Amount *</th>
                                <th className="text-left p-2 font-medium">Payment Method *</th>
                                <th className="text-left p-2 font-medium">Date *</th>
                                <th className="text-left p-2 font-medium">Reference</th>
                                <th className="text-left p-2 font-medium">Receipt</th>
                                <th className="text-left p-2 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id} className="border-b">
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">
                                        <Select
                                            value={form.watch(`tithes.${index}.assembly`)}
                                            onValueChange={(value) => form.setValue(`tithes.${index}.assembly`, value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {assemblies.map((assembly) => (
                                                    <SelectItem key={assembly.id} value={assembly.id}>
                                                        {assembly.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-2">
                                        <Select
                                            value={form.watch(`tithes.${index}.member`)}
                                            onValueChange={(value) => form.setValue(`tithes.${index}.member`, value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {members.map((member) => (
                                                    <SelectItem key={member.id} value={member?.id || ""}>
                                                        {member.first_name} {member.last_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            className="w-full"
                                            {...form.register(`tithes.${index}.amount`)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Select
                                            value={form.watch(`tithes.${index}.payment_method`)}
                                            onValueChange={(value) => form.setValue(`tithes.${index}.payment_method`, value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentMethods.map((method) => (
                                                    <SelectItem key={method.label} value={method.value}>
                                                        {method.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {form.watch(`tithes.${index}.timestamp`) ? (
                                                        format(form.watch(`tithes.${index}.timestamp`), "MM/dd/yyyy")
                                                    ) : (
                                                        <span>Pick date</span>
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
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            placeholder="Reference"
                                            className="w-full"
                                            {...form.register(`tithes.${index}.reference_code`)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            className="w-full"
                                            {...form.register(`tithes.${index}.receipt`)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onRemove(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}