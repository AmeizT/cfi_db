"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Users, Heart, Droplets, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
    AttendanceFormSchema,
    AttendanceCategories,
    CategoryLabels,
    type AttendanceFormData,
    type AttendanceCategory,
} from "../schemas/attendance"
import { useUser } from "@/hooks/query/use-user"
import { useHomecell } from "../hooks/use-homecells"
import { createAttendance } from "../actions/create-attendance"
import { FormState } from "@/types/form-state"
import FormContainer from "@/features/reports/components/FormContainer"
import { Homecell } from "@/features/groups/schemas/homecell"

const initialFormState: FormState = {
    message: "Idle",
    success: false,
    status: -1,
}

export function AttendanceForm() {
    const { data: user } = useUser()
    const { data: homecells } = useHomecell()
    const ref = React.useRef<HTMLFormElement>(null)
    const [formState, formAction, isPending] = React.useActionState(
        createAttendance, 
        initialFormState
    )

    const assemblies = user?.assemblies || []

    console.log(formState)

    const form = useForm<AttendanceFormData>({
        resolver: zodResolver(AttendanceFormSchema),
        defaultValues: {
            church: String(user?.church),
            homecell: "",
            category: AttendanceCategories.Sunday,
            preacher: "",
            sermon: "",
            scriptures: "",
            headcount: "",
            adults: "",
            children: "",
            visitors: "",
            newcomers: "",
            altar_call: "",
            baptism: "",
            summary: "",
            achievements: "",
            timestamp: new Date(),
            start_time: undefined,
            end_time: undefined,
        },
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const selectedCategory = form.watch("category")
    const headcount = form.watch("headcount")
    const adults = form.watch("adults")
    const children = form.watch("children")

    const totalAgeGroups = (Number(adults) || 0) + (Number(children) || 0)
    const headcountNumber = Number(headcount) || 0

    async function attendanceFormAction(formData: FormData){
        const data = form.getValues()

        formData.append("church", String(user?.church))
        formData.append("created_by", String(user?.id))
        formData.append("timestamp", data.timestamp.toISOString().split("T")[0])
        formData.append("start_time", String(data.start_time?.toISOString()))
        formData.append("end_time", String(data.end_time?.toISOString()))

        await formAction(formData)
    }

    return (
        <FormContainer
        ref={ref}
        context={form}
        action={attendanceFormAction}
        isPending={isPending}
        onClick={() => form.reset()}
        >
            <div className="px-4">
                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="church">Church/Assembly *</Label>
                                    <Select name="church" value={form.watch("church")} onValueChange={(value) => form.setValue("church", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Church" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assemblies.map((assembly) => (
                                                <SelectItem key={assembly?.id} value={String(assembly?.id)}>
                                                    {assembly?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.church && (
                                        <p className="text-sm text-red-600">{form.formState.errors.church.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Service Category *</Label>
                                    <Select
                                        value={form.watch("category")}
                                        onValueChange={(value) => form.setValue("category", value as AttendanceCategory)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(CategoryLabels).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.category && (
                                        <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
                                    )}
                                </div>

                                {selectedCategory === "Homecell" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="homecell">Home Cell</Label>
                                        <Select value={form.watch("homecell")} onValueChange={(value) => form.setValue("homecell", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Home Cell" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {homecells?.map((cell: Homecell) => (
                                                    <SelectItem key={cell?.id} value={String(cell?.id)}>
                                                        {cell?.group_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="timestamp">Service Date *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !form.watch("timestamp") && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {form.watch("timestamp") ? format(form.watch("timestamp"), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={form.watch("timestamp")}
                                                onSelect={(date) => form.setValue("timestamp", date || new Date())}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {form.formState.errors.timestamp && (
                                        <p className="text-sm text-red-600">{form.formState.errors.timestamp.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Start Time</Label>
                                    <Input
                                        id="start_time"
                                        type="datetime-local"
                                        value={form.watch("start_time") ? format(form.watch("start_time")!, "yyyy-MM-dd'T'HH:mm") : ""}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            form.setValue("start_time", value ? new Date(value) : undefined)
                                        }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time">End Time</Label>
                                    <Input
                                        id="end_time"
                                        type="datetime-local"
                                        value={form.watch("end_time") ? format(form.watch("end_time")!, "yyyy-MM-dd'T'HH:mm") : ""}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            form.setValue("end_time", value ? new Date(value) : undefined)
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5" />
                                Service Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="preacher">Preacher/Speaker</Label>
                                    <Input id="preacher" placeholder="e.g., Pastor John Smith" {...form.register("preacher")} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sermon">Sermon Title</Label>
                                    <Input id="sermon" placeholder="e.g., Walking in Faith" {...form.register("sermon")} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scriptures">Scripture References</Label>
                                <Input id="scriptures" placeholder="e.g., Matthew 5:1-12, Romans 8:28" {...form.register("scriptures")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="summary">Service Summary</Label>
                                <Textarea
                                    id="summary"
                                    placeholder="Brief summary of the service, key points, or highlights..."
                                    {...form.register("summary")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="achievements">Achievements/Special Events</Label>
                                <Textarea
                                    id="achievements"
                                    placeholder="Any special achievements, milestones, or notable events during the service..."
                                    {...form.register("achievements")}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Numbers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Attendance Numbers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="headcount">Total Headcount *</Label>
                                    <Input id="headcount" type="number" min="0" placeholder="0" {...form.register("headcount")} />
                                    {form.formState.errors.headcount && (
                                        <p className="text-sm text-red-600">{form.formState.errors.headcount.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adults">Adults</Label>
                                    <Input id="adults" type="number" min="0" placeholder="0" {...form.register("adults")} />
                                    {form.formState.errors.adults && (
                                        <p className="text-sm text-red-600">{form.formState.errors.adults.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="children">Children</Label>
                                    <Input id="children" type="number" min="0" placeholder="0" {...form.register("children")} />
                                    {form.formState.errors.children && (
                                        <p className="text-sm text-red-600">{form.formState.errors.children.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Validation warning for age groups */}
                            {totalAgeGroups > 0 && headcountNumber > 0 && totalAgeGroups > headcountNumber && (
                                <Alert className="border-orange-200 bg-orange-50">
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                    <AlertDescription className="text-orange-700">
                                        Adults and children count ({totalAgeGroups}) exceeds total headcount ({headcountNumber})
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="visitors">Visitors</Label>
                                    <Input id="visitors" type="number" min="0" placeholder="0" {...form.register("visitors")} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newcomers">First-time Visitors</Label>
                                    <Input id="newcomers" type="number" min="0" placeholder="0" {...form.register("newcomers")} />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="altar_call" className="flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        Altar Call Responses
                                    </Label>
                                    <Input id="altar_call" type="number" min="0" placeholder="0" {...form.register("altar_call")} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="baptism" className="flex items-center gap-2">
                                        <Droplets className="h-4 w-4" />
                                        Baptisms
                                    </Label>
                                    <Input id="baptism" type="number" min="0" placeholder="0" {...form.register("baptism")} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Card */}
                    {headcountNumber > 0 && (
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Attendance Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-700">{headcountNumber}</p>
                                        <p className="text-sm text-blue-600">Total Attendance</p>
                                    </div>
                                    {Number(adults) > 0 && (
                                        <div>
                                            <p className="text-2xl font-bold text-blue-700">{adults}</p>
                                            <p className="text-sm text-blue-600">Adults</p>
                                        </div>
                                    )}
                                    {Number(children) > 0 && (
                                        <div>
                                            <p className="text-2xl font-bold text-blue-700">{children}</p>
                                            <p className="text-sm text-blue-600">Children</p>
                                        </div>
                                    )}
                                    {Number(form.watch("visitors")) > 0 && (
                                        <div>
                                            <p className="text-2xl font-bold text-blue-700">{form.watch("visitors")}</p>
                                            <p className="text-sm text-blue-600">Visitors</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </FormContainer>
        
    )
}
