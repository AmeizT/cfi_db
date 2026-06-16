export function getComplianceTabs() {
    const tabs = [
        {
            label: "Status",
            key: "status",
            get href() {
                return `/reports/compliance/status`
            },
        },
        {
            label: "Audit Logs",
            key: "audit-logs",
            get href() {
                return `/reports/compliance/audit-logs`
            },
        },
    ]

    return tabs
}