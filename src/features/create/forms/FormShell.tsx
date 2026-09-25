"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { assemblyQueryKeys } from "@/lib/query-keys"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { createRecord, getCreateOptions } from "@/features/create/forms/actions"
import { createSchemas, imageError, type CreateEntity } from "@/features/create/forms/contracts"

export type FormValues = Record<string, unknown>
export const directoryRoutes: Record<CreateEntity, string> = {
    members: "/members/directory", households: "/members/households",
    homecells: "/spaces", assets: "/assets",
}
const cacheParts: Record<CreateEntity, string[][]> = {
    members: [["people", "members"], ["people", "member-directory"], ["people", "children"]],
    households: [["people", "households"]], homecells: [["spaces", "homecells"], ["homecells"]], assets: [["finance", "assets"]],
}

export function useCreateOptions() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "create", "options"),
        queryFn: () => getCreateOptions(assemblyId!), enabled: Boolean(assemblyId),
        staleTime: 0, gcTime: 0, retry: false,
    })
}

type FormShellProps = {
    entity: CreateEntity
    title: string
    children: ReactNode
    inline?: { onCancel: () => void; fullFormHref: string; presentation?: "detail" | "row"; onCreated?: (id: string) => void }
}

export function FormShell({ entity, title, children, inline }: FormShellProps) {
    const assemblyId = useActiveAssemblyId()
    // Remount all form/selector state on a workspace change, including unsaved PII.
    return <ScopedForm key={`${entity}:${assemblyId}`} entity={entity} title={title} assemblyId={assemblyId} inline={inline}>{children}</ScopedForm>
}

function ScopedForm({ entity, title, assemblyId, children, inline }: FormShellProps & { assemblyId?: string }) {
    const methods = useForm<FormValues>({ shouldUnregister: true, defaultValues: entity === "members" ? { phone_number: "", ministries: [], positions: [] } : {} })
    const options = useCreateOptions()
    const queryClient = useQueryClient()
    const locked = useRef(false)
    const [pending, setPending] = useState(false)
    const [finished, setFinished] = useState(false)
    const [message, setMessage] = useState("")
    const allowed = Boolean(options.data)
    const inlineMode = Boolean(inline)
    const firstField = entity === "members" ? "first_name" : entity === "assets" ? "item_name" : entity === "homecells" ? "group_name" : "name"
    useEffect(() => {
        if (inlineMode && allowed) methods.setFocus(firstField)
    }, [inlineMode, allowed, methods, firstField])

    const submit = async (values: FormValues) => {
        methods.clearErrors()
        const schema = createSchemas[entity]
        const payload: FormValues = {}
        for (const [name, field] of Object.entries(schema.shape)) {
            const value = values[name]
            if (field.isOptional() && (value === "" || value === undefined)) continue
            payload[name] = value
        }
        const parsed = schema.safeParse(payload)
        if (!parsed.success) {
            parsed.error.issues.forEach(issue => methods.setError(String(issue.path[0]), { message: issue.message }))
            methods.setFocus(String(parsed.error.issues[0]?.path[0]))
            setMessage("Please check the highlighted fields.")
            locked.current = false
            setPending(false)
            return
        }
        const formData = new FormData()
        formData.set("values", JSON.stringify(parsed.data))
        const uploadField = entity === "members" ? "avatar" : entity === "assets" ? "asset_images" : null
        const files = uploadField ? Array.from((values[uploadField] as FileList | undefined) ?? []) : []
        const fileError = imageError(files)
        if (fileError) {
            methods.setError(uploadField!, { message: fileError })
            locked.current = false
            setPending(false)
            return
        }
        files.forEach(file => formData.append(uploadField!, file))
        try {
            const result = await createRecord(entity, assemblyId!, formData)
            if (result.status === "invalid") {
                Object.entries(result.errors).forEach(([field, error]) => methods.setError(field, { message: error }))
                setMessage(result.message)
                toast.error(result.message)
                locked.current = false
                return
            }
            setFinished(true)
            if (!inline) methods.reset()
            if (result.status === "uncertain") {
                setMessage(result.message)
                toast.error(result.message)
                return
            }
            const success = result.verified ? `${title} created.` : "Record saved. Check the directory to confirm its details."
            setMessage(success)
            toast.success(success)
            await Promise.allSettled([
                ...cacheParts[entity].map(parts => queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, ...parts) })),
                ...(entity === "members" ? [queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, "create") })] : []),
            ])
            if (inline?.onCreated && result.id) {
                inline.onCreated(result.id)
            } else if (inline && result.verified) {
                methods.reset()
                setFinished(false)
                locked.current = false
                // Focus after React re-enables the fieldset following the save.
                requestAnimationFrame(() => methods.setFocus(firstField))
            }
        } catch {
            setFinished(true)
            setMessage("The save could not be confirmed. Check the directory before creating another record.")
            toast.error("The save could not be confirmed. Check the directory.")
        } finally { setPending(false) }
    }

    return <section aria-label={inline ? `Add ${title.toLowerCase()}` : undefined} aria-labelledby={inline ? undefined : "record-form-title"} className={inline?.presentation === "row" ? "p-3 text-sm text-foreground" : inline?.presentation === "detail" ? "p-4 sm:p-6 text-foreground" : inline ? "border-b border-border-subtle bg-muted/20 p-4 text-sm text-foreground" : "mx-auto w-full max-w-4xl py-8 text-foreground"}>
            {!inline && <h2 id="record-form-title" className="text-3xl font-semibold">Create {title.toLowerCase()}</h2>}
            {(!inline || !options.data) && <p className="mt-2 mb-6 text-sm text-muted-foreground">{options.data ? `Assembly: ${options.data.assembly.name}` : "Loading active assembly…"}</p>}
            {options.isError && <p role="alert" className="mb-4 text-destructive">Unable to load this assembly. Reopen the form and try again.</p>}
            <FormProvider {...methods}>
                <form noValidate={inlineMode} onKeyDown={event => {
                    if (inline && event.key === "Escape" && !pending) {
                        event.preventDefault()
                        event.stopPropagation()
                        inline.onCancel()
                    }
                }} onSubmit={event => {
                    event.preventDefault()
                    if (locked.current || !allowed || !assemblyId) return
                    locked.current = true
                    setPending(true)
                    setMessage("")
                    void methods.handleSubmit(submit)(event)
                }}>
                    {!finished && <fieldset disabled={pending || !allowed} className={inline?.presentation === "row" ? "grid grid-cols-2 gap-3 lg:grid-cols-6 disabled:opacity-70" : inline?.presentation === "detail" ? "space-y-6 disabled:opacity-70" : inline ? "grid grid-cols-2 gap-3 disabled:opacity-70" : "space-y-6 disabled:opacity-70"}>{children}</fieldset>}
                    {message && <p role="status" className="my-5 rounded-lg border border-border bg-card p-4 text-sm">{message}</p>}
                    {methods.formState.errors.assembly && <p role="alert" className="my-3 text-sm text-destructive">The assembly may have changed. Reopen the form.</p>}
                    <div className={inline ? "mt-3 flex flex-wrap items-center justify-end gap-2" : "mt-8 flex items-center justify-end gap-3"}>
                        {inline && !pending && <Link href={inline.fullFormHref} className="mr-auto text-xs text-muted-foreground underline underline-offset-4">Open full form</Link>}
                        {inline ? <Button type="button" size="sm" variant="ghost" disabled={pending} onClick={inline.onCancel}>Cancel</Button> :
                        <Button type="button" variant="outline" asChild><Link href={directoryRoutes[entity]}>{finished ? "View directory" : "Cancel"}</Link></Button>}
                        {!finished && <Button type="submit" size={inline ? "sm" : "default"} disabled={pending || !allowed} aria-busy={pending}>{pending ? "Creating…" : (inline ? "Create" : `Create ${title.toLowerCase()}`)}</Button>}
                    </div>
                </form>
            </FormProvider>
    </section>
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
    return <section className="rounded-xl border border-border bg-card p-5 text-card-foreground">
        <h2 className="mb-5 text-lg font-semibold">{title}</h2>
        <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
}

export type FieldProps = {
    name: string; label: string; required?: boolean; allowEmpty?: boolean; type?: string;
    choices?: readonly string[]; multiple?: boolean; help?: string; maxLength?: number; placeholder?: string;
}
export function Field({ name, label, required, allowEmpty, type = "text", choices, multiple, help, maxLength = 255, placeholder }: FieldProps) {
    const { register, formState: { errors } } = useFormContext<FormValues>()
    const error = errors[name]?.message
    const fieldId = useId()
    const common = { id: fieldId, "aria-invalid": Boolean(error), "aria-describedby": `${fieldId}-help ${fieldId}-error` }
    return <div className="grid content-start gap-2">
        <label htmlFor={fieldId} className="text-sm font-medium">{label}{required && <span aria-label="required"> *</span>}</label>
        {choices ? <select {...common} {...register(name)} multiple={multiple} required={required && !allowEmpty} className="min-h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
            {!multiple && <option value="">Choose {label.toLowerCase()}</option>}
            {choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
        </select> : type === "textarea" ? <Textarea {...common} {...register(name)} maxLength={maxLength} />
            : <Input {...common} {...register(name)} placeholder={placeholder} className={placeholder ? "placeholder:text-muted-foreground" : undefined} type={type} required={required && !allowEmpty} maxLength={maxLength}
                {...(type === "file" ? { accept: "image/jpeg,image/png,image/webp", multiple } : {})}
                {...(type === "number" ? { min: 0, step: 1 } : {})} />}
        {help && <p id={`${fieldId}-help`} className="text-xs text-muted-foreground">{help}</p>}
        {error && <p id={`${fieldId}-error`} role="alert" className="text-xs text-destructive">{String(error)}</p>}
    </div>
}
