interface Props {
    tab: "monthly" | "analytics"
    label: string
}

export function StatementsLabel({ tab, label }: Props) {
  const viewLabel = tab === "monthly" ? "Monthly" : "Analytics"

    return (
        <h2>
            <span className="font-bold">{label}</span>
            <span className="font-semibold text-gray-300"> — {viewLabel}</span>
        </h2>
    )
}