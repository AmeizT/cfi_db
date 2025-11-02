import * as React from "react"
import { useSearchParams } from "next/navigation"

export function useQueryString() {
    const searchParams = useSearchParams()

    const createQueryString = React.useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())

            if (value === "All" || value === "" || value == null) {
                params.delete(name) 
            } else {
                params.set(name, value)
            }

            return params.toString()
        },
        [searchParams]
    )

    return { createQueryString }
}