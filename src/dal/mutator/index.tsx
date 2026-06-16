"use server";

import { cookies } from "next/headers";

/**
 * Generic fetcher for DAL
 * @template T - response type
 */
export default async function mutator<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    // Get HttpOnly cookies from Next.js server
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(url, {
        method: options?.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader,
            ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Network error: ${res.status}`);
    }

    // If the endpoint returns no content (204), return null
    if (res.status === 204) return null as unknown as T;

    return res.json() as Promise<T>;
}