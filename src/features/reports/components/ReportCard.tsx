import React, { useMemo, useState } from "react"
import {
    IconDots,
    IconSquare,
    IconSquareCheckFilled
} from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator";

interface Section {
    id: string;
    title: string;
    submitted: boolean;
}

interface ReportCardProps {
    month: string;
    sections: Section[]
    status?: "draft" | "finalized" | "missing"
    isLoading?: boolean
    onSectionToggle?: (sectionId: string) => void;
    onMenuClick?: () => void;
    onClick?: () => void;
}

function useReportProgress(sections: Section[]) {
    return useMemo(() => {
        const completedCount = sections?.filter(s => s?.submitted)?.length
        const completionPercent = Math.round((completedCount / sections?.length) * 100)
        const allComplete = completedCount === sections?.length

        return { completedCount, completionPercent, allComplete }
    }, [sections])
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

export function ReportCard({
    month,
    sections,
    status,
    isLoading = false,
    onSectionToggle,
    onMenuClick,
    onClick
}: ReportCardProps) {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const { completedCount, completionPercent, allComplete } = useReportProgress(sections);

    // Card styling based on status
    const cardClasses = cn(
        "border-[1px] rounded-lg transition-all duration-300 cursor-pointer",
        status === "finalized" ? "border-slate-200 hover:border-green-300 hover:shadow-lg bg-white" : "border-dashed border-amber-200 hover:border-amber-300 hover:shadow-lg bg-white",
        isLoading && "opacity-60 pointer-events-none"
    );

    // const statusBadgeClasses = cn(
    //     "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all",
    //     status === "finalized" && "bg-green-500 text-white shadow-lg shadow-green-500/30",
    //     status === "draft" && "bg-orange-400 text-white shadow-lg shadow-orange-400/30"
    // )

    const handleSectionClick = (sectionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (status !== "finalized" && onSectionToggle) {
            onSectionToggle(sectionId);
        }
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMenuClick?.();
    };

    const handleKeyDown = (sectionId: string, e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (status !== "finalized" && onSectionToggle) {
                onSectionToggle(sectionId);
            }
        }
    };

    // Empty state
    if (sections?.length === 0) {
        return (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-8 text-center">
                <p className="text-slate-400 text-sm">No sections available</p>
            </div>
        );
    }

    return (
        <div className={cardClasses} onClick={onClick}>
            <div className="w-full h-12 flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">
                        {month}
                    </h5>

                    {/* {status && (
                        <span className={statusBadgeClasses}>
                            {status === "finalized" && <IconLock className="size-3" />}
                            {status === "finalized" ? "Finalized" : "Draft"}
                        </span>
                    )} */}
                </div>

                <button
                type="button"
                aria-label="Report options menu"
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                onClick={handleMenuClick}>
                    <IconDots className="size-5 text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            {/* {allComplete && status !== "finalized" && (
                <div className="mx-4 mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2">
                    <IconSparkles className="size-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        All sections complete! Ready to finalize 🎉
                    </span>
                </div>
            )} */}

            {/* Circular progress with completion text */}
            <div className="px-3 flex items-center gap-3">
                {/* Circular progress */}
                <div className="relative w-12 h-12">
                    <svg className="transform -rotate-90 w-12 h-12">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-amber-200"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionPercent / 100)}`}
                            className={`transition-all duration-700 ease-out ${allComplete ? "text-green-500" : "text-amber-500"
                                }`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-[10px] font-bold ${allComplete ? 'text-green-600' : 'text-amber-500'
                            }`}>
                            {completionPercent}%
                        </span>
                    </div>
                </div>

                {/* Completion text */}
                <div>
                    <p className="text-sm font-medium text-gray-700">{completedCount}/4 Complete</p>
                    <p className="text-xs text-gray-500">
                        {allComplete ? 'All sections done!' : `${4 - completedCount} remaining`}
                    </p>
                </div>
            </div>

            <ul className="mt-3 px-2 pb-1.5 w-full space-y-0">
                {sections?.map((section, index) => {
                    const isHovered = hoveredSection === section.id
                    const isLocked = status === "finalized"

                    return (
                        <React.Fragment key={section.id}>
                            <li
                                key={section.id}
                                role="button"
                                tabIndex={isLocked ? -1 : 0}
                                aria-label={`${section.title} - ${section.submitted ? "completed" : "pending"}`}
                                className={cn(
                                    "py-2 md:py-1.5 px-2 flex gap-3 items-center rounded font-medium transition-all duration-200 border-b-0 border-amber-100 dark:border-slate-700 last:border-b-0",
                                    section.submitted && status === "draft" ? "text-amber-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500",
                                    !isLocked && status === "draft" ? "hover:bg-amber-100 dark:hover:bg-blue-900/20 hover:scale-[1.02] cursor-pointer" : "hover:bg-green-100",
                                    isLocked && "opacity-75 cursor-not-allowed",
                                    isHovered && !isLocked && "bg-blue-50 dark:bg-blue-900/20"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={(e) => handleSectionClick(section.id, e)}
                                onMouseEnter={() => setHoveredSection(section.id)}
                                onMouseLeave={() => setHoveredSection(null)}
                                onKeyDown={(e) => handleKeyDown(section.id, e)}
                            >
                                {/* Checkbox */}
                                <div
                                    className={cn(
                                        "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
                                    )}
                                >
                                    {section.submitted ? (
                                        <IconSquareCheckFilled className={cn("size-4.5", status === "draft" ? "text-amber-500" : "text-green-500")} />
                                    ) : (
                                        <IconSquare strokeWidth={2.2} className={cn("size-4.5", status === "draft" ? "text-amber-500" : "text-green-500")} />
                                    )}
                                </div>

                                {/* Section Title */}
                                <span className={cn("text-sm flex-1 text-slate-700", section.submitted && "line-through")}>
                                    {section.title}
                                </span>

                                {/* Hover Arrow */}
                                {isHovered && !isLocked && (
                                    <svg
                                        className="size-4 text-amber-500 dark:text-blue-400 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                )}
                            </li>

                            <Separator className={cn("my-1.5 last:hidden", status === "draft" ? "bg-amber-100" : "bg-green-100")} />
                        </React.Fragment>
                    );
                })}
            </ul>

            {/* {isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            )} */}
        </div>
    );
}

// Example usage
export const defaultSections: Section[] = [
    { id: "attendance", title: "Attendance", submitted: false },
    { id: "expenses", title: "Expenses", submitted: true },
    { id: "income", title: "Income", submitted: false },
    { id: "tithes", title: "Tithes", submitted: false }
];

// export default function Example() {
//     const [sections, setSections] = useState(defaultSections);

//     const handleToggle = (sectionId: string) => {
//         setSections(prev =>
//             prev.map(s =>
//                 s.id === sectionId ? { ...s, submitted: !s.submitted } : s
//             )
//         );
//     };

//     return (
//         <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
//             <div className="max-w-md mx-auto space-y-6">
//                 <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Report Cards</h1>

//                 <ReportCard
//                     month="January"
//                     sections={sections}
//                     status="draft"
//                     onSectionToggle={handleToggle}
//                     onMenuClick={() => console.log("Menu clicked")}
//                     onClick={() => console.log("Card clicked")}
//                 />

//                 <ReportCard
//                     month="February"
//                     sections={defaultSections.map(s => ({ ...s, submitted: true }))}
//                     status="finalized"
//                     onMenuClick={() => console.log("Menu clicked")}
//                 />

//                 <ReportCard
//                     month="March"
//                     sections={defaultSections}
//                     status="draft"
//                     isLoading={true}
//                 />
//             </div>
//         </div>
//     )
// }