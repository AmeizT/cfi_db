import { HeadersConfigProps } from "@/types"

type HeaderOptions = {
    token?: string
    multipart?: boolean
    useBearer?: boolean
}

/**
 * Build a configurable headers object for axios/fetch requests.
 * 
 * @param options.token Optional JWT or Bearer token
 * @param options.multipart If true, uses multipart/form-data
 * @param options.useBearer If true, uses "Bearer" instead of "JWT"
 */
export function buildHeaders({
    token,
    multipart = false,
    useBearer = false,
}: HeaderOptions = {}): HeadersConfigProps {
    const authType = useBearer ? "Bearer" : "JWT"

    return {
        headers: {
            Accept: "application/json",
            "Content-Type": multipart ? "multipart/form-data" : "application/json",
            ...(token && { Authorization: `${authType} ${token}` }),
        },
    }
}

export const jsonHeaders: HeadersConfigProps = {
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
}

export const multipartHeaders: HeadersConfigProps = {
    headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
    },
}

export const withJwt = (token?: string): HeadersConfigProps =>
    buildHeaders({ token })

export const withBearer = (token?: string): HeadersConfigProps =>
    buildHeaders({ token, useBearer: true })

export const withMultipartJwt = (token?: string): HeadersConfigProps =>
    buildHeaders({ token, multipart: true })

export const withMultipartBearer = (token?: string): HeadersConfigProps =>
    buildHeaders({ token, multipart: true, useBearer: true })