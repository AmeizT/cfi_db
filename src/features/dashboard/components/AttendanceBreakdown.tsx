import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";

export function AttendanceBreakdown() {
    const data = [
        { label: "Sunday Service", value: 642 },
        { label: "Midweek", value: 318 },
        { label: "Home Cell", value: 210 },
        { label: "Youth", value: 145 },
        { label: "Online", value: 823 },
    ];

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
                <SectionHeader title="Attendance breakdown" />

                <div className="space-y-3">
                    {data.map((item) => (
                        <div key={item.label} className="flex justify-between text-sm">
                            <span>{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-3 border-t text-sm flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">2,138</span>
                </div>
            </CardContent>
        </Card>
    );
}