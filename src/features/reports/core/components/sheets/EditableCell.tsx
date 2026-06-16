type Props = {
    value: string | number
    rowIndex: number
    colIndex: number
    onChange: (value: string) => void
}

function focusCell(row: number, col: number) {
    const el = document.getElementById(`cell-${row}-${col}`)
    el?.focus()
}

export function EditableCell({ value, rowIndex, colIndex, onChange }: Props) {

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const current = e.currentTarget

        if (e.key === "ArrowRight") {
            focusCell(rowIndex, colIndex + 1)
        }

        if (e.key === "ArrowLeft") {
            focusCell(rowIndex, colIndex - 1)
        }

        if (e.key === "ArrowDown") {
            focusCell(rowIndex + 1, colIndex)
        }

        if (e.key === "ArrowUp") {
            focusCell(rowIndex - 1, colIndex)
        }

        if (e.key === "Enter") {
            focusCell(rowIndex + 1, colIndex)
        }
    }

    return (
        <input
            id={`cell-${rowIndex}-${colIndex}`}
            defaultValue={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none"
        />
    )
}