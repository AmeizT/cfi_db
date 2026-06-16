export function SectionLabel({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2.5 ${className}`}
        >
            {children}
        </div>
    );
}