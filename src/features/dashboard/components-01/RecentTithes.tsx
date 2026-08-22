import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";

export function RecentTithes() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <SectionHeader
                    title="Recent tithes"
                    right={<Button variant="ghost" size="sm">View all</Button>}
                />

                <div className="text-sm text-muted-foreground">
                    No recent data
                </div>
            </CardContent>
        </Card>
    );
}