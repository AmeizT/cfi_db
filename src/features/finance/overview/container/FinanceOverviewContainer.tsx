"use client"

import { ExpensesChart } from "../../wallet/components/ExpensesChart"
import { TithesSummary } from "../components/TitheSummary"

export function FinanceOverviewContainer(){
    return (
        <div className="px-4 lg:px-12 w-full flex gap-x-4">
            <div className="w-full lg:w-2/3 flex flex-col">
                {/* <Shortcuts /> */}
                <ExpensesChart />
                <TithesSummary />
            </div>

            <div className="w-1/3 h-full hidden lg:flex bg-gray-200">

            </div>
        </div>
    )
}

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Shortcut {
    url: string;
    label: string;
}

const MAX_SHORTCUTS = 5;

export function Shortcuts() {
    const pathname = usePathname();
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("shortcuts");
        if (stored) {
            setShortcuts(JSON.parse(stored));
        }
    }, []);

    // Track URL changes
    useEffect(() => {
        if (!pathname) return;

        setShortcuts((prev) => {
            // Avoid duplicates
            const existing = prev.filter((s) => s.url !== pathname);

            const updated = [
                { url: pathname, label: pathname.replace("/", "") || "Home" },
                ...existing,
            ].slice(0, MAX_SHORTCUTS);

            localStorage.setItem("shortcuts", JSON.stringify(updated));
            return updated;
        });
    }, [pathname]);

    if (shortcuts.length === 0) return null;

    return (
        <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Shortcuts</h3>
            <ul className="flex flex-col gap-2">
                {shortcuts.map((s) => (
                    <li key={s.url}>
                        <Link
                            href={s.url}
                            className="text-theme-600 hover:underline text-sm"
                        >
                            {s.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}