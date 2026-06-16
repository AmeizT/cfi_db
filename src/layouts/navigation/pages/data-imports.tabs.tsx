export function getDataImportTabs() {
    const tabs = [
        {
            label: "Imports",
            key: "Imports",
            get href() {
                return `/reports/data-imports/`
            },
        },
        {
            label: "History",
            key: "history",
            get href() {
                return `/reports/data-imports/history`
            },
        },
    ]

    return tabs
}