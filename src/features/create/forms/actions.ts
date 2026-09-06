"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import { apiRoutes, getServerUrl } from "@/config/urls"
import { withJwt } from "@/config/headers"
import { createSchemas, entitySchema, imageError, safeFieldErrors, type CreateResult } from "./contracts"

const scopeSchema = z.string().regex(/^\d+$/)
const endpoints = {
    members: apiRoutes.members,
    households: apiRoutes.households,
    assets: apiRoutes.finance.assets,
    homecells: apiRoutes.spaces.homecells,
}
const optionsSchema = z.object({
    assembly: z.object({ id: z.number(), name: z.string() }),
    can_create_member: z.boolean(),
    members: z.array(z.object({ id: z.number(), label: z.string() })),
    has_more: z.boolean(), ministries: z.array(z.string()), positions: z.array(z.string()),
})
export type CreateOptions = z.infer<typeof optionsSchema>

export async function getCreateOptions(assemblyId: string, search = "", page = 1): Promise<CreateOptions> {
    const scope = scopeSchema.parse(assemblyId)
    const token = (await cookies()).get("accessToken")?.value
    if (!token) throw new Error("Please sign in to create records.")
    try {
        const response = await fetch(getServerUrl("api/v1/people/create-options"), {
            method: "POST", cache: "no-store",
            headers: { ...withJwt(token).headers, "X-Assembly-ID": scope },
            body: JSON.stringify({ search: z.string().max(100).parse(search), page: z.number().int().positive().parse(page) }),
        })
        if (!response.ok) throw new Error()
        const options = optionsSchema.parse(await response.json())
        if (String(options.assembly.id) !== scope) throw new Error()
        return options
    } catch {
        throw new Error("Unable to load this assembly. Reopen the form and try again.")
    }
}

export async function createRecord(entityInput: string, assemblyId: string, formData: FormData): Promise<CreateResult> {
    const entity = entitySchema.safeParse(entityInput)
    const scope = scopeSchema.safeParse(assemblyId)
    if (!entity.success || !scope.success) return { status: "invalid", errors: {}, message: "Reopen the form and try again." }
    const token = (await cookies()).get("accessToken")?.value
    if (!token) return { status: "invalid", errors: {}, message: "Please sign in to create records." }
    const schema = createSchemas[entity.data]
    let raw: unknown
    try { raw = JSON.parse(String(formData.get("values"))) } catch { raw = null }
    const parsed = schema.safeParse(raw)
    if (!parsed.success) return {
        status: "invalid", message: "Please check the highlighted fields.",
        errors: Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])),
    }
    const uploadField = entity.data === "members" ? "avatar" : entity.data === "assets" ? "asset_images" : null
    const files = uploadField ? formData.getAll(uploadField).filter((entry): entry is File => entry instanceof File && entry.size > 0) : []
    const uploadError = imageError(files) ?? (entity.data === "members" && files.length > 1 ? "Choose one image." : null)
    if (uploadError) return { status: "invalid", errors: { [uploadField!]: uploadError }, message: uploadError }
    const endpoint = endpoints[entity.data]
    const headers = new Headers(withJwt(token).headers as HeadersInit)
    headers.set("X-Assembly-ID", scope.data)
    let body: BodyInit = JSON.stringify(parsed.data)
    if (files.length) {
        const multipart = new FormData()
        for (const [field, value] of Object.entries(parsed.data)) {
            if (Array.isArray(value)) value.forEach(item => multipart.append(field, String(item)))
            else multipart.append(field, String(value))
        }
        files.forEach(file => multipart.append(uploadField!, file))
        headers.delete("Content-Type") // fetch must generate the multipart boundary.
        body = multipart
    }
    let response: Response
    try {
        response = await fetch(endpoint.list(), { method: "POST", headers, body, cache: "no-store" })
    } catch {
        return { status: "uncertain", message: "The save could not be confirmed. Check the directory before creating another record." }
    }
    if (!response.ok) {
        if (response.status >= 500) return { status: "uncertain", message: "The save could not be confirmed. Check the directory before creating another record." }
        const payload: unknown = await response.json().catch(() => null)
        return {
            status: "invalid", errors: safeFieldErrors(payload, [...Object.keys(schema.shape), "assembly", "avatar", "asset_images"]),
            message: response.status === 401 ? "Please sign in to create records."
                : response.status === 403 ? "You do not have permission to create this record."
                    : "Unable to create the record. Check the form and active assembly, then try again.",
        }
    }
    // A successful write is never retried if the verification read fails.
    const result = await response.json().catch(() => null)
    const key = entity.data === "members" ? result?.member_key : result?.id
    if (typeof key !== "string" && typeof key !== "number") return { status: "created", id: "", verified: false }
    try {
        const read = await fetch(endpoint.detail(key), { headers, cache: "no-store" })
        const record = read.ok ? await read.json() : null
        const recordKey = entity.data === "members" ? record?.member_key : record?.id
        const recordAssembly = typeof record?.assembly === "object" ? record?.assembly?.id : record?.assembly
        const verified = String(recordKey) === String(key)
            && String(recordAssembly) === scope.data
        return { status: "created", id: String(key), verified }
    } catch {
        return { status: "created", id: String(key), verified: false }
    }
}
