import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    value: string
    change?: string
    trend?: "up" | "down"
}

export function StatCard({ title, value, change, trend, ...rest }: StatCardProps) {
    return (
        <Card {...rest} className={cn("rounded-2xl shadow-sm", rest.className)}>
            <CardContent className="p-5 space-y-2">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
                {change && (
                    <p
                        className={cn(
                            "text-sm",
                            trend === "up" ? "text-green-600" : "text-red-500"
                        )}
                    >
                        {change}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}