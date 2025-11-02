export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="reports-layout">
            <div>Reports</div>
            {children}
        </div>
    )
}
