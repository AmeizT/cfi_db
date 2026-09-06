"use client"

import { useState, type ReactNode } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FormShell, Section, useCreateOptions, type FieldProps } from "./FormShell"
import { MemberSelector } from "./MemberSelector"
import { education, genders, prefixes, relationships, statuses } from "./contracts"

const personal: FieldProps[] = [
    { name: "prefix", label: "Title", choices: prefixes }, { name: "middle_name", label: "Middle name", maxLength: 100 },
    { name: "maiden_name", label: "Maiden name", maxLength: 100 }, { name: "place_of_birth", label: "Place of birth", maxLength: 100 },
    { name: "relationship", label: "Relationship status", choices: relationships }, { name: "marriage_date", label: "Marriage date", type: "date" },
    { name: "spouse", label: "Spouse" }, { name: "date_of_death", label: "Date of death", type: "date" },
    { name: "avatar", label: "Photo", type: "file", help: "JPEG, PNG, or WebP. Maximum 500 KB." },
]
const contact: FieldProps[] = [
    { name: "email", label: "Email", type: "email", maxLength: 254 }, { name: "secondary_phone_number", label: "Secondary phone", type: "tel", maxLength: 17 },
    { name: "address", label: "Address" }, { name: "address_line2", label: "Address line 2" },
    { name: "city", label: "City" }, { name: "province", label: "Province", maxLength: 100 },
]
const church: FieldProps[] = [
    { name: "membersince", label: "Member since", type: "date" }, { name: "membership_status", label: "Membership status", choices: statuses },
    { name: "membership_stage", label: "Membership stage", choices: ["new", "established", "associate"] },
    { name: "previous_church", label: "Previous church" }, { name: "baptized_at", label: "Baptism date", type: "date", help: "The existing backend derives baptized status from this date." },
    { name: "baptized_where", label: "Baptism location" }, { name: "confirmation_date", label: "Confirmation date", type: "date" },
]
const additional: FieldProps[] = [
    { name: "occupation", label: "Occupation" }, { name: "employer", label: "Employer" },
    { name: "education_level", label: "Education level", choices: education }, { name: "skills", label: "Skills" },
    { name: "emergency_contact_name", label: "Emergency contact name" }, { name: "emergency_contact_relationship", label: "Emergency contact relationship", maxLength: 100 },
    { name: "emergency_contact_phone", label: "Emergency contact phone", type: "tel", maxLength: 17 },
    { name: "notes", label: "Notes", type: "textarea", maxLength: 10000 },
]

function OptionalSection({ title, fields, children }: { title: string; fields: FieldProps[]; children?: ReactNode }) {
    const [visible, setVisible] = useState<string[]>([])
    const { unregister } = useFormContext()
    return <Section title={title}>
        {children}
        {fields.filter(field => visible.includes(field.name)).map(field => <div key={field.name} className={field.name === "spouse" ? "sm:col-span-2" : ""}>
            {field.name === "spouse" ? <MemberSelector name="spouse" label="Spouse" /> : <Field {...field} />}
            <Button type="button" variant="ghost" size="sm" className="mt-1 text-muted-foreground" onClick={() => { unregister(field.name); setVisible(visible.filter(name => name !== field.name)) }}>Remove {field.label.toLowerCase()}</Button>
        </div>)}
        {visible.length < fields.length && <label className="grid gap-2 text-sm sm:col-span-2">
            Add field to {title.toLowerCase()}
            <select value="" className="rounded-md border border-border bg-background p-2 text-foreground" onChange={event => setVisible([...visible, event.target.value])}>
                <option value="">Choose an optional field…</option>
                {fields.filter(field => !visible.includes(field.name)).map(field => <option key={field.name} value={field.name}>{field.label}</option>)}
            </select>
        </label>}
    </Section>
}

function MemberFields() {
    const options = useCreateOptions()
    return <>
        <OptionalSection title="Personal information" fields={personal}>
            <Field name="first_name" label="First name" required maxLength={100} />
            <Field name="last_name" label="Last name" required maxLength={100} />
            <Field name="date_of_birth" label="Date of birth" type="date" required />
            <Field name="gender" label="Gender" choices={genders} required />
        </OptionalSection>
        <OptionalSection title="Church information" fields={church}>
            <Field name="ministries" label="Ministries" choices={options.data?.ministries ?? []} multiple required allowEmpty help="Leave unselected if none. Use Ctrl/Cmd to select multiple." />
            <Field name="positions" label="Positions" choices={options.data?.positions ?? []} multiple required allowEmpty help="Leave unselected if none. Use Ctrl/Cmd to select multiple." />
        </OptionalSection>
        <OptionalSection title="Contact information" fields={contact}>
            <Field name="phone_number" label="Phone number" type="tel" maxLength={17} required allowEmpty help="May be blank if no phone number is available." />
            <Field name="country" label="Country of residence" required help="The member’s contact country, stored independently of the assembly’s country." />
        </OptionalSection>
        <OptionalSection title="Additional information" fields={additional} />
    </>
}

export function MemberForm() {
    return <FormShell entity="members" title="Member"><MemberFields /></FormShell>
}
