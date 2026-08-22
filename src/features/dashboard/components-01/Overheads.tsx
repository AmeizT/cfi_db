import { Button } from "@/components/ui/button"
import { SectionHeader } from "./SectionHeader"
import { Card, CardContent } from "@/components/ui/card"

export function Overheads() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <SectionHeader
                    title="Overheads"
                    right={<Button variant="ghost" size="sm">Details</Button>}
                />

                <div className="text-sm">
                    Staff Salaries — BWP 22,000
                </div>
            </CardContent>
        </Card>
    )
}