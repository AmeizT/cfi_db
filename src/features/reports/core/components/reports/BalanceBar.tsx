import { fmtCurrency } from "../../utils"

interface BalanceBarProps {
    revenue: number;
    expenses: number;
}

/**
 * Stacked bar showing revenue vs expenses with a net balance label.
 */
export function BalanceBar({ revenue, expenses }: BalanceBarProps) {
    if (!revenue && !expenses) return null;

    const total = Math.max(revenue, expenses, 1);
    const revPct = (revenue / total) * 100;
    const expPct = (expenses / total) * 100;
    const balance = revenue - expenses;
    const positive = balance >= 0;

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    Revenue vs Expenses
                </span>
                <span
                    className={`font-mono text-[10px] font-semibold ${positive ? "text-primary" : "text-red-400"
                        }`}
                >
                    {positive ? "+" : ""}
                    {fmtCurrency(balance)}
                </span>
            </div>

            {/* Track */}
            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                {/* Revenue layer */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full opacity-60 bg-primary"
                    style={{ width: `${revPct}%` }}
                />
                {/* Expenses layer */}
                <div
                    className={`absolute inset-y-0 left-0 rounded-full ${positive ? "bg-primary/30" : "bg-red-400"
                        }`}
                    style={{ width: `${expPct}%` }}
                />
            </div>
        </div>
    );
}
