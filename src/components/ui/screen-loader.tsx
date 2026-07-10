import { cn } from "@/lib/utils";
import {Text} from "./text"

export function ScreenLoader() {
    
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl">
            <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
            <p className="mt-4 text-xl font-semibold text-muted-foreground tracking-tight">
                Getting <Text variant="shine" 
                    className="text-xl font-semibold bg-[linear-gradient(110deg,var(--user-theme),35%,var(--user-theme-highlight),50%,var(--user-theme),75%,var(--user-theme))] dark:bg-[linear-gradient(110deg,var(--user-theme),35%,white,50%,var(--user-theme),75%,var(--user-theme))]">everything</Text> ready...
            </p>
        </div>
    )
}