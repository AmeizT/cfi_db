"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, PrinterIcon as Print, CheckCircle } from "lucide-react"
import { Tithe } from "../schemas/tithes"

interface TithePreviewProps {
    data: Tithe[]
    onBack: () => void
    isSubmitted?: boolean
}

export function TithePreview({ data, onBack, isSubmitted = false }: TithePreviewProps) {
    const totalAmount = data.reduce((sum, tithe) => sum + (Number(tithe.amount) || 0), 0)

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case "BANK":
                return "Bank Transfer"
            case "MOBILE":
                return "Mobile Money"
            case "CASH":
                return "Cash"
            default:
                return method
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        alert("Download functionality would be implemented here")
    }

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Form
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Tithe Entries Preview</h1>
                        <p className="text-muted-foreground">
                            {isSubmitted ? "Successfully submitted entries" : "Review before submitting"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Print className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {isSubmitted && (
                <Card className="mb-6 border-green-200 bg-green-50">
                    <CardContent className="flex items-center gap-3 p-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                            <p className="font-medium text-green-800">Entries Submitted Successfully</p>
                            <p className="text-sm text-green-700">
                                {data.length} tithe {data.length === 1 ? "entry has" : "entries have"} been saved to the system.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Summary</span>
                        <Badge className="text-lg px-3 py-1">
                            {data.length} {data.length === 1 ? "Entry" : "Entries"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">Total Amount</p>
                            <p className="text-2xl font-bold text-green-700">
                                ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-theme-50 rounded-lg">
                            <p className="text-sm text-theme-600 font-medium">Payment Methods</p>
                            <div className="flex flex-wrap gap-1 justify-center mt-1">
                                {[...new Set(data.map((t) => t.payment_method))].map((method) => (
                                    <Badge key={method} variant="outline" className="text-xs">
                                        {getPaymentMethodLabel(method)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-600 font-medium">Assemblies</p>
                            <p className="text-lg font-semibold text-purple-700">
                                {data?.map((tithe) => tithe?.assembly)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Individual Entries */}
            <div className="space-y-4">
                {data.map((tithe, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Entry {index + 1}</span>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{getPaymentMethodLabel(tithe.payment_method)}</Badge>
                                    <span className="font-mono text-lg">
                                        ${Number(tithe.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Assembly</p>
                                    <p className="font-medium">{tithe.assembly}</p>
                                </div>
                                {tithe.member && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Member</p>
                                        <p className="font-medium">{tithe.member}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p className="font-medium">
                                        
                                    </p>
                                </div>
                                {tithe.reference_code && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Reference Code</p>
                                        <p className="font-mono text-sm">{tithe.reference_code}</p>
                                    </div>
                                )}
                                {tithe.receipt && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Receipt</p>
                                        <p className="text-sm text-green-600">✓ Attached</p>
                                    </div>
                                )}
                                {tithe.notes && (
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <p className="text-sm text-muted-foreground">Notes</p>
                                        <p className="text-sm">{tithe.notes}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
