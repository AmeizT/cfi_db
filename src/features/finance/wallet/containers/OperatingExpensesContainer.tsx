"use client"

import React from "react"
import { formatCurrency } from "@/utils"
import { Badge } from "@/components/ui/badge"
import { Church, Expenditure, FixedExpenditure, Tithe } from "@/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { User } from "@/features/auth/schemas/user"

interface RegularExpenditureProps {
    churches: Church[]
    regularExpenditure?: FixedExpenditure
    adhocExpenditure: Expenditure[]
    tithes: Tithe[]
    user: User | null
    formattedDate: string
    height: number
}

export function RegularExpenditure(props: RegularExpenditureProps) {
    const { churches, regularExpenditure, user } = props
    const lang = churches?.find(church => church?.id === user?.church)?.lang
    const currency = churches?.find(church => church?.id === user?.church)?.currency

    // const filterBaseMonthTithes = tithes?.filter(
    //     tithe => moment(tithe?.timestamp)?.format("MMYYYY") === formattedDate
    // )

    // function calculateTotalDynamicExpenditure(data: Expenditure[]) {
    //     const dynamicExpenditureTotal = data?.reduce((accumulator: number, current) => accumulator + (Number(current?.total) || 0), 0)

    //     return dynamicExpenditureTotal || 0
    // }

    const monthlyRegularExpenditure = [
        {
            name: "Remittance - @25% of Tithes",
            value: formatCurrency(lang, currency, regularExpenditure?.remittance || 0)
        },
        {
            name: "Bank Charges",
            value: formatCurrency(lang, currency, regularExpenditure?.bank_charges || 0),
        },
        {
            name: "Building Security",
            value: formatCurrency(lang, currency, regularExpenditure?.security || 0),
        },
        {
            name: "Car Maintenance",
            value: formatCurrency(lang, currency, regularExpenditure?.car_maintenance || 0),
        },
        {
            name: "Electricity, Gas",
            value: formatCurrency(lang, currency, regularExpenditure?.electricity || 0),
        },
        {
            name: "Fuel",
            value: formatCurrency(lang, currency, regularExpenditure?.fuel || 0),
        },
        {
            name: "Humanitarian",
            value: formatCurrency(lang, currency, regularExpenditure?.humanitarian || 0),
        },
        {
            name: "Insurance",
            value: formatCurrency(lang, currency, regularExpenditure?.insurance || 0),
        },
        {
            name: "Internet",
            value: formatCurrency(lang, currency, regularExpenditure?.internet || 0),
        },
        {
            name: "Investment",
            value: formatCurrency(lang, currency, regularExpenditure?.investment || 0),
        },
        {
            name: "Rent",
            value: formatCurrency(lang, currency, regularExpenditure?.rent || 0),
        },
        {
            name: "Salaries and Wages",
            value: formatCurrency(lang, currency, regularExpenditure?.wages || 0),
        },
        {
            name: "Telephone Charges",
            value: formatCurrency(lang, currency, regularExpenditure?.telephone || 0),
        },

        {
            name: "Water",
            value: formatCurrency(lang, currency, regularExpenditure?.water || 0),
        },
    ]

    const isRemittancePaymentVerified = regularExpenditure?.is_remittance_verified

    return (
        <div aria-label="Regular Expenditure" aria-describedby="regular_expenditure" className="">
            <Accordion type="single" defaultValue="regularExp" collapsible className="w-full border-b-0">
                <AccordionItem value={"regularExp"} className="w-full border-b-0">
                    <AccordionTrigger className="h-9 flex flex-grow items-center text-body text-base font-semibold rounded-t-md">
                        Regular Expenditure
                    </AccordionTrigger>

                    <Sheet>
                        <SheetTrigger asChild>
                            <button disabled={regularExpenditure === undefined} className="w-full disabled:cursor-not-allowed">
                                <AccordionContent className="pb-0">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr hidden></tr>
                                        </thead>

                                        <tbody>
                                            {monthlyRegularExpenditure?.map((expenditure, key) => (
                                                <React.Fragment key={key}>
                                                    {expenditure?.name?.toLowerCase()?.includes("remittance") ? (
                                                        <tr className={`h-10 first:border-t last:border-b-0 border-b border-muted-foreground font-semibold`}>
                                                            <td className={`px-0`}>
                                                                {expenditure.name}&nbsp;&nbsp;<Badge className={`${isRemittancePaymentVerified ? "text-green-500 bg-green-500/10 hover:bg-green-500/10" : "text-red-500 bg-red-500/10 hover:bg-red-500/10"}`}>
                                                                    {isRemittancePaymentVerified ? "Paid" : "Due"}
                                                                </Badge>
                                                            </td>

                                                            <td className={`px-0 text-right font-geist`}>
                                                                {expenditure.value}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <tr className="h-10 first:border-t last:border-b-0 border-b border-muted-foreground">
                                                            <td className={`px-0`}>
                                                                {expenditure.name}
                                                            </td>

                                                            <td className={`px-0 text-right font-geist`}>
                                                                {expenditure.value}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>

                                        <tfoot className="hidden">
                                            <tr className="h-10 border-t border-muted font-semibold">
                                                <td className="px-3 xl:px-4">Total</td>
                                                <td className="px-3 xl:px-4 text-right">
                                                    {regularExpenditure?.total || 0}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                </AccordionContent>
                            </button>
                        </SheetTrigger>

                        <SheetContent aria-describedby={undefined} className="overflow-y-auto">
                            <SheetTitle className="hidden"></SheetTitle>
                            <SheetDescription className="hidden"></SheetDescription>
                        </SheetContent>
                    </Sheet>
                </AccordionItem>
            </Accordion>
        </div>
    )
}


