"use client"
import { useFormContext } from "react-hook-form"
import { Field, FormShell, Section } from "./FormShell"
import { MemberSelector } from "./MemberSelector"

function HomecellFields() {
    const { register } = useFormContext()
    return <>
        <Section title="Homecell information">
            <Field name="group_name" label="Group name" required />
            <Field name="description" label="Description" type="textarea" maxLength={10000} />
            <Field name="non_church_members" label="Non-church members" type="textarea" maxLength={10000} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("is_archived")} /> Archived</label>
        </Section>
        <Section title="Leadership and membership">
            <MemberSelector name="leader_id" label="Leader" />
            <MemberSelector name="member_ids" label="Members" multiple />
        </Section>
    </>
}
export function HomecellForm() {
    return <FormShell entity="homecells" title="Homecell"><HomecellFields /></FormShell>
}
