import React from "react"
import { useSearchParams } from "next/navigation"

export function useQueryParams() {
    const searchParams = useSearchParams()

    const setParam = React.useCallback(
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

    const clearAllParams = React.useCallback(() => {
        const params = new URLSearchParams()
        const year = searchParams.get("year")
        if (year) params.set("year", year)
        return params.toString()
    }, [searchParams])

    return { setParam, clearAllParams }
}