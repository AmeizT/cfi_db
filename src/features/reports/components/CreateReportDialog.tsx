import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { IconPlus } from "@tabler/icons-react"
import { CreateReportForm } from "../forms/ReportForm"

export function CreateReportDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="h-9 bg-slate-950 hover:bg-slate-900 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-medium rounded-[10px] shadow-none hover:scale-[1.03] active:scale-95 ease-[cubic-bezier(0.25,1,0.5,1)] transition-transform">
                    <IconPlus strokeWidth={2} /> Create Report
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl py-0 px-0">
                <DialogHeader className="px-4 pt-4">
                    <DialogTitle>Create report</DialogTitle>
                    <DialogDescription className="hidden">
                        Make changes to your profile here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>

                <CreateReportForm />

                <DialogFooter className="hidden">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
