import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FORM_META } from "../config/form"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconCaretDownFilled } from "@tabler/icons-react"

interface CategoryDropdownProps {
    mode: "reports" | "entries"
}

export function CategoryDropdown({ mode }: CategoryDropdownProps) {
    const searchParams = useSearchParams()
    const categories = Object.entries(FORM_META ?? {}).map(
        ([key, value]) => ({
            key,
            ...value,
        })
    )
    const defaultEntriesForm = FORM_META.entries["assets"] 
    const defaultReportForm = FORM_META.reports["attendance"]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-2 capitalize">
                    {mode}

                    <IconCaretDownFilled className="size-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {categories.map((item) => {
                    // const isActive = searchParams.get("form") === item.key || (!searchParams.get("form") && ((mode === "entries" && item.key === defaultEntriesForm.key) || (mode === "reports" && item.key === defaultReportForm.key)))

                    return (
                        <DropdownMenuItem key={item.key} asChild>
                            <Link
                                href={{
                                    pathname: "/manage",
                                    query: {
                                        ...Object.fromEntries(searchParams.entries()),
                                        form: item.key.includes("entries") ? defaultEntriesForm.key : defaultReportForm.key,
                                        mode: item.key
                                    },
                                }}
                                className={`capitalize py-1! rounded-md! text-sm focus:bg-gray-200/60`}
                            >
                                {item.key}
                            </Link>

                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}