import { IconTrash, IconRestore } from "@tabler/icons-react"

interface TitheActionButtonProps {
    isTrashPage: boolean
}

export function TitheActionButton({ isTrashPage }: TitheActionButtonProps) {
    return (
        <button type="submit" className={`w-full px-2 py-1.5 flex items-center gap-x-2`}>
            {isTrashPage ? (
                <IconRestore strokeWidth={1.75} className="size-4.5" />
            ) : (
                <IconTrash strokeWidth={1.75} className="size-4.5" />
            )}
            {isTrashPage ? "Restore" : "Move to Trash"}
        </button>
    )
}