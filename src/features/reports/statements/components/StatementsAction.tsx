import { Flex } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Plus } from "lucide-react";
import { PeriodSelector } from "./PeriodSelector";

export function StatementsAction() {
    return (
        <Flex gap={2}>
            <PeriodSelector />

            <Flex align="center" className="h-10 relative z-20 bg-linear-to-b from-indigo-500 to-indigo-600 rounded-xl">
                <Button className="has-[>svg]:px-3 h-full gap-1 rounded-none rounded-l-xl bg-transparent hover:bg-theme-600">
                    <Plus className="size-4" /> Create
                </Button>

                <Separator orientation="vertical" className="data-[orientation=vertical]:h-3/5 bg-theme-400" />

                <Button className="size-10 flex justify-center items-center rounded-none rounded-r-xl bg-transparent hover:bg-linear-to-b from-indigo-600 to-indigo-700">
                    <ChevronDown />
                </Button>
            </Flex>
        </Flex>
    )
}