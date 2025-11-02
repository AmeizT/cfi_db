import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from "react"
import { FormSwitcher } from "./FormSwitcher"

interface NewRecordData {
    category?: "record" | "submission" | "other"
    form: "expenses" | "income" | "attendance" | "tithes"
    type?: "fixed" | "variable" 
}

export function CreateRecordDialog(){
    const defaultRecord: NewRecordData = {
        form: "attendance",
        category: "record",
    }

    const [newRecord, setNewRecord] = React.useState<NewRecordData>(defaultRecord)

    function handleFormChange(form: "expenses" | "income" | "attendance" | "tithes"){
        setNewRecord({form: form})
    }

    return (
        <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className="p-0 min-w-1/2 h-[50dvh] rounded-2xl gap-0">
                <DialogHeader className="px-0 py-0 h-12 border-b-[0.5px] border-gray-300">
                    <DialogTitle className="sr-only">Create New Record</DialogTitle>
                    <DialogDescription className="sr-only">
                        Fill out the form to add a new record to the database. You can provide details such as name, type, and any relevant information. This action will save the record for future reference.
                    </DialogDescription>

                    <nav className="px-4 h-full flex items-center">
                        <ul className="flex gap-4">
                            {recordMenu.map(item => (
                                <li key={item.name}>
                                    <button onClick={() => handleFormChange("expenses")} className="capitalize tracking-normal text-sm text-muted-foreground hover:text-neutral-700 font-medium transition-colors">
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </DialogHeader>

                <div className="h-full overflow-y-auto">
                    <FormSwitcher currentForm={newRecord.form} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

const recordMenu = [
    {
        name: "attendance",
    },
    {
        name: "expenses",
    },
    {
        name: "income",
    },
    {
        name: "tithes",
    }
]