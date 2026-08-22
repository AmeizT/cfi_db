import { FileClockIcon, FileDownloadIcon, FileEditIcon } from "@hugeicons/core-free-icons"
import type { NavGroup } from "../types"
import { MagicWand3Icon } from '@solar-icons/react/bold-duotone/magic-wand-3'
import { ListCheckMinimalisticIcon } from '@solar-icons/react/bold-duotone/list-check-minimalistic'
import { PenNewSquareIcon } from '@solar-icons/react/bold-duotone/pen-new-square'
import { ChecklistMinimalisticIcon } from '@solar-icons/react/bold-duotone/checklist-minimalistic'

export function reportWizard(): NavGroup[] {
    return [
        {
            id: "report-wizard-main",
            label: "Report Wizard",
            items: [
                {
                    label: "New Report",
                    description: "Start or continue report entry",
                    icon: PenNewSquareIcon,
                    activeIcon: PenNewSquareIcon,
                    href: "/report-wizard",
                    exact: true,
                },
                {
                    label: "Tasks",
                    description: "Unfinished reports that still need sections",
                    icon: ChecklistMinimalisticIcon,
                    activeIcon: ChecklistMinimalisticIcon,
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
                    icon: MagicWand3Icon,
                    activeIcon: MagicWand3Icon,
                    href: "#",
                    exact: true,
                },
            ],
        },
    ]
}
