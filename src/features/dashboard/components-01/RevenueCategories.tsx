import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";

export function RevenueCategories() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <SectionHeader title="Revenue categories" />
                <div className="space-y-3 text-sm">
                    <div>
                        <div className="flex justify-between">
                            <span>Tithes</span>
                            <span>62.6%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1">
                            <div className="h-2 bg-green-500 rounded-full w-[62%]" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}