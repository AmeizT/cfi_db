interface BadgeProps {
    children: React.ReactNode;
    variant: "stable" | "missing" | "best";
}

export function Badge({ children, variant }: BadgeProps) {
    const styles = {
        stable: "bg-emerald-100 text-emerald-700",
        missing: "bg-orange-100 text-orange-700",
        best: "bg-theme-100 text-theme-700",
    };

    return (
        <span
            className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[variant]}`}
        >
            {children}
        </span>
    );
}