import { ReportStatus } from "../../types/status.type"

type FilterKey = "all" | ReportStatus;

interface Tab {
    key: FilterKey;
    label: string;
    colorClass?: string;
    activeBg?: string;
    activeBorder?: string;
}

interface FilterTabsProps {
    active: FilterKey;
    counts: Record<ReportStatus, number>;
    total: number;
    onChange: (key: FilterKey) => void;
}

export function FilterTabs({ active, counts, total, onChange }: FilterTabsProps) {
    const tabs: Tab[] = [
        {
            key: "all",
            label: `All · ${total}`
        },
        {
            key: "draft",
            label: `Draft · ${counts.draft}`,
            colorClass: "text-orange-400",
            activeBg: "bg-orange-400/10",
            activeBorder: "border-orange-400/30"
        },
        {
            key: "finalized",
            label: `Finalized · ${counts.finalized}`,
            colorClass: "text-primary",
            activeBg: "bg-primary/10",
            activeBorder: "border-primary/30"
        },
        {
            key: "reviewed",
            label: `Reviewed · ${counts.reviewed}`,
            colorClass: "text-teal-500",
            activeBg: "bg-teal-500/10",
            activeBorder: "border-teal-500/30"
        },
    ];

    return (
        <div className="flex flex-wrap gap-1.5">
            {tabs.map((tab) => {
                const isActive = active === tab.key

                return (
                    <button
                        key={tab.key}
                        onClick={() => onChange(tab.key)}
                        className={`
                            px-3 h-7 rounded-full border-[1.5px] border-dashed text-[13px] font-semibold transition-all duration-150
                            ${isActive
                                ? `border-solid ${tab.activeBg ?? "bg-foreground/10"} ${tab.activeBorder ?? "border-foreground/20"} ${tab.colorClass ?? "text-foreground"}`
                                : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}
