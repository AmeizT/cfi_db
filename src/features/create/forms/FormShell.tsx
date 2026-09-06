"use client"

import { useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { assemblyQueryKeys } from "@/lib/query-keys"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { CreateTopbar } from "../CreateTopbar"
import { createRecord, getCreateOptions } from "./actions"
import { createSchemas, imageError, type CreateEntity } from "./contracts"

export type FormValues = Record<string, unknown>
export const directoryRoutes: Record<CreateEntity, string> = {
    members: "/app/members/directory", households: "/app/members/households",
    homecells: "/app/spaces/home-cells", assets: "/app/finance/assets",
}
const cacheParts: Record<CreateEntity, string[][]> = {
    members: [["people", "members"], ["people", "member-directory"]],
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

export function FormShell({ entity, title, children }: { entity: CreateEntity; title: string; children: ReactNode }) {
    const assemblyId = useActiveAssemblyId()
    // Remount all form/selector state on a workspace change, including unsaved PII.
    return <ScopedForm key={`${entity}:${assemblyId}`} entity={entity} title={title} assemblyId={assemblyId}>{children}</ScopedForm>
}

function ScopedForm({ entity, title, assemblyId, children }: { entity: CreateEntity; title: string; assemblyId?: string; children: ReactNode }) {
    const methods = useForm<FormValues>({ shouldUnregister: true, defaultValues: entity === "members" ? { phone_number: "", ministries: [], positions: [] } : {} })
    const options = useCreateOptions()
    const queryClient = useQueryClient()
    const locked = useRef(false)
    const [pending, setPending] = useState(false)
    const [finished, setFinished] = useState(false)
    const [message, setMessage] = useState("")
    const allowed = Boolean(options.data)

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
            methods.reset()
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
        } catch {
            setFinished(true)
            setMessage("The save could not be confirmed. Check the directory before creating another record.")
            toast.error("The save could not be confirmed. Check the directory.")
        } finally { setPending(false) }
    }

    return <div className="min-h-screen bg-background text-foreground">
        <CreateTopbar />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
            <Link href="/create" className="text-sm text-primary">← Back to Create</Link>
            <h1 className="mt-5 text-3xl font-semibold">Create {title.toLowerCase()}</h1>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">{options.data ? `Assembly: ${options.data.assembly.name}` : "Loading active assembly…"}</p>
            {options.isError && <p role="alert" className="mb-4 text-destructive">Unable to load this assembly. Reopen the form and try again.</p>}
            <FormProvider {...methods}>
                <form onSubmit={event => {
                    event.preventDefault()
                    if (locked.current || !allowed || !assemblyId) return
                    locked.current = true
                    setPending(true)
                    setMessage("")
                    void methods.handleSubmit(submit)(event)
                }}>
                    {!finished && <fieldset disabled={pending || !allowed} className="space-y-6 disabled:opacity-70">{children}</fieldset>}
                    {message && <p role="status" className="my-5 rounded-lg border border-border bg-card p-4 text-sm">{message}</p>}
                    {methods.formState.errors.assembly && <p role="alert" className="my-3 text-sm text-destructive">The assembly may have changed. Reopen the form.</p>}
                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Button type="button" variant="outline" asChild><Link href={finished ? directoryRoutes[entity] : "/create"}>{finished ? "View directory" : "Cancel"}</Link></Button>
                        {!finished && <Button type="submit" disabled={pending || !allowed} aria-busy={pending}>{pending ? "Creating…" : `Create ${title.toLowerCase()}`}</Button>}
                    </div>
                </form>
            </FormProvider>
        </main>
    </div>
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
    return <section className="rounded-xl border border-border bg-card p-5 text-card-foreground">
        <h2 className="mb-5 text-lg font-semibold">{title}</h2>
        <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
}

export type FieldProps = {
    name: string; label: string; required?: boolean; allowEmpty?: boolean; type?: string;
    choices?: readonly string[]; multiple?: boolean; help?: string; maxLength?: number;
}
export function Field({ name, label, required, allowEmpty, type = "text", choices, multiple, help, maxLength = 255 }: FieldProps) {
    const { register, formState: { errors } } = useFormContext<FormValues>()
    const error = errors[name]?.message
    const common = { id: name, "aria-invalid": Boolean(error), "aria-describedby": `${name}-help ${name}-error` }
    return <div className="grid content-start gap-2">
        <label htmlFor={name} className="text-sm font-medium">{label}{required && <span aria-label="required"> *</span>}</label>
        {choices ? <select {...common} {...register(name)} multiple={multiple} required={required && !allowEmpty} className="min-h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
            {!multiple && <option value="">Choose {label.toLowerCase()}</option>}
            {choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
        </select> : type === "textarea" ? <Textarea {...common} {...register(name)} maxLength={maxLength} />
            : <Input {...common} {...register(name)} type={type} required={required && !allowEmpty} maxLength={maxLength}
                {...(type === "file" ? { accept: "image/jpeg,image/png,image/webp", multiple } : {})}
                {...(type === "number" ? { min: 0, step: 1 } : {})} />}
        {help && <p id={`${name}-help`} className="text-xs text-muted-foreground">{help}</p>}
        {error && <p id={`${name}-error`} role="alert" className="text-xs text-destructive">{String(error)}</p>}
    </div>
}
