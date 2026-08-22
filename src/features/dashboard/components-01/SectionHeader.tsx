export function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            {right}
        </div>
    );
}