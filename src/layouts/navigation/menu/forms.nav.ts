import { NavItem } from "../types"
import { AddCircleIcon, AddInvoiceIcon, CalendarAdd01Icon, FavouriteIcon, WalletAdd02Icon } from "@hugeicons/core-free-icons"

export function forms(reportId?: string): NavItem[] {
    return [
        {
            label: "Attendance",
            href: `/forms?cat=report&form=attendance&report_id=${reportId || ""}`,
            icon: CalendarAdd01Icon,
            activeIcon: CalendarAdd01Icon,
            children: []
        },
        {
            label: "Income",
            href: `/forms?cat=report&form=income&report_id=${reportId || ""}`,
            icon: WalletAdd02Icon,
            activeIcon: WalletAdd02Icon,
            children: []
        },
        {
            label: "Expenses",
            href: `/forms?cat=report&form=expenses&report_id=${reportId || ""}`,
            icon: AddInvoiceIcon,
            activeIcon: AddInvoiceIcon,
            children: []
        },
        {
            label: "Tithes",
            href: `/forms?cat=report&form=tithes&report_id=${reportId || ""}`,
            icon: FavouriteIcon,
            activeIcon: FavouriteIcon,
            children: []
        },
        {
            label: "All Forms",
            href: "/forms",
            icon: AddCircleIcon,
            activeIcon: AddCircleIcon,
            children: []
        }
    ]
}