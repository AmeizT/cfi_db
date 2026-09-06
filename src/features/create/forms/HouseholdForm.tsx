"use client"
import { Field, FormShell, Section } from "./FormShell"

export function HouseholdForm() {
    return <FormShell entity="households" title="Household">
        <Section title="Household information">
            <Field name="name" label="Household name" required />
            <Field name="status" label="Status" choices={["active", "inactive", "closed"]} help="Defaults to active." />
        </Section>
        <Section title="Contact information">
            <Field name="phone_number" label="Phone" type="tel" maxLength={17} />
            <Field name="secondary_phone_number" label="Secondary phone" type="tel" maxLength={17} />
            <Field name="email" label="Email" type="email" maxLength={254} />
            <Field name="address" label="Address" /><Field name="address_line2" label="Address line 2" />
            <Field name="city" label="City" /><Field name="province" label="Province" maxLength={100} /><Field name="country" label="Country" />
            <Field name="notes" label="Notes" type="textarea" maxLength={10000} />
        </Section>
        <p className="text-sm text-muted-foreground">Create the household first, then manage its members from the household directory.</p>
    </FormShell>
}
