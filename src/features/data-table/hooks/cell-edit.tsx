export const handleCellEdit = async (rowIndex: number, columnId: string, value: unknown) => {
    try {
        await fetch(`/api/tithes/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                [columnId]: value,
            }),
        })

        console.log("Updated successfully")
    } catch (error) {
        console.error("Update failed", error)
    }
}