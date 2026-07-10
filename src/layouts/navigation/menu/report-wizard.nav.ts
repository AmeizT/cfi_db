import { FileClockIcon, FileDownloadIcon, FileEditIcon } from "@hugeicons/core-free-icons"
import type { NavGroup } from "../types"

export function reportWizard(): NavGroup[] {
    return [
        {
            id: "report-wizard-main",
            label: "Report Wizard",
            items: [
                {
                    label: "New Report",
                    description: "Start or continue report entry",
                    icon: FileEditIcon,
                    activeIcon: FileEditIcon,
                    href: "/report-wizard",
                    exact: true,
                },
                {
                    label: "In Progress",
                    description: "Unfinished reports that still need sections",
                    icon: FileClockIcon,
                    activeIcon: FileClockIcon,
                    href: "/report-wizard/in-progress",
                    exact: true,
                },
            ],
        },
        {
            id: "report-wizard-resources",
            label: "Resources",
            items: [
                {
                    label: "Download Template",
                    description: "Download report templates",
                    icon: FileDownloadIcon,
                    activeIcon: FileDownloadIcon,
                    href: "#",
                    exact: true,
                },
            ],
        },
    ]
}
