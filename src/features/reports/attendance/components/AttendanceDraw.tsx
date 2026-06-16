"use client"

import { Drawer, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"

export default function VaulDrawer() {
    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button>
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2.5} /> New Record
                </Button>
            </DrawerTrigger>
            <DrawerPortal>
                <DrawerOverlay className="fixed inset-0 bg-black/40" />
                <DrawerContent className="flex flex-col fixed bottom-0 right-0 max-h-dvh w-1/3 bg-theme-500">
                    <div className="w-1/3 mx-auto overflow-auto p-4 rounded-t-[10px] bg-red-500">
                        <DrawerTitle className="font-medium text-gray-900 mt-8">New Project</DrawerTitle>
                        <DrawerDescription className="leading-6 mt-2 text-gray-600">
                            Get started by filling in the information below to create your new project.
                        </DrawerDescription>
                        <label htmlFor="name" className="font-medium text-gray-900 text-sm mt-8 mb-2 block">
                            Project name
                        </label>
                        <input
                            id="name"
                            className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
                        />
                        <label htmlFor="name" className="font-medium text-gray-900 text-sm mt-8 mb-2 block">
                            Description
                        </label>
                        <textarea
                            rows={6}
                            className="border border-gray-200 bg-white w-full resize-none rounded-lg p-3 pt-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-black/5 focus:ring-offset-0"
                        />
                        <button className="h-11 bg-black text-gray-50 rounded-lg mt-4 w-full font-medium">Submit</button>
                    </div>
                </DrawerContent>
            </DrawerPortal>
        </Drawer>
    )
}






import { useState } from "react"
import { SERVICE_TYPES, WEATHER_OPTIONS } from "../constants"
import { getDrawerBadgeColor } from "../utils"
import { DrawerField } from "./DrawerField"
import { Attendance } from "@/dal/types"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"

interface AttendanceDrawerProps {
    row: Attendance;
    onClose: () => void;
    onSave: (updated: Attendance) => void;
    onDelete: (id: number) => void;
}

const inputClass = `
  w-full bg-muted/40 border border-border rounded-lg
  px-3 py-2.5 text-sm text-foreground outline-none
  transition-colors focus:border-primary/50
  placeholder:text-muted-foreground/50
`;

// export function AttendanceDrawer({ row, onClose, onSave, onDelete }: AttendanceDrawerProps) {
//     const [form, setForm] = useState<Attendance>({ ...row });

//     const set = <K extends keyof Attendance>(k: K, v: Attendance[K]) =>
//         setForm((f) => ({ ...f, [k]: v }));

//     const badge = getDrawerBadgeColor(form?.service_type || "", form?.is_special_event || false);

//     return (
//         <div className="fixed inset-0 z-50 flex items-stretch">
//             {/* Backdrop */}
//             <div
//                 onClick={onClose}
//                 className="flex-1 bg-black/75 backdrop-blur-md"
//             />

//             {/* Panel */}
//             <div
//                 className="w-[460px] flex flex-col bg-card border-l border-border overflow-y-auto"
//                 style={{ animation: "drawerIn 0.22s cubic-bezier(0.22,1,0.36,1)" }}
//             >
//                 {/* Header */}
//                 <div className="px-7 pt-7 pb-5 border-b border-border">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <div className="flex items-center gap-2 mb-2">
//                                 <span className={`
//                   text-[11px] px-2.5 py-0.5 rounded font-mono font-semibold tracking-wider border
//                   ${badge.bg} ${badge.text} ${badge.border}
//                 `}>
//                                     {form.is_special_event
//                                         ? `✦ ${form.special_event_name || "Special"}`
//                                         : form.service_type}
//                                 </span>
//                                 {form.weather && (
//                                     <span className="text-xs text-muted-foreground">{form.weather}</span>
//                                 )}
//                             </div>
//                             <div className="text-[22px] font-bold text-foreground leading-tight">
//                                 {form.timestamp}
//                             </div>
//                             <div className="text-sm text-muted-foreground mt-1">
//                                 {form.preacher || "No preacher set"}
//                             </div>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="text-muted-foreground hover:text-foreground transition-colors text-xl p-1 leading-none"
//                         >
//                             ✕
//                         </button>
//                     </div>
//                 </div>

//                 {/* Form */}
//                 <div className="px-7 py-6 flex flex-col gap-4 flex-1">
//                     <div className="grid grid-cols-2 gap-3.5">
//                         <DrawerField label="Date">
//                             <input
//                                 type="date"
//                                 value={form.timestamp}
//                                 onChange={(e) => set("timestamp", e.target.value)}
//                                 className={inputClass}
//                             />
//                         </DrawerField>
//                         <DrawerField label="Service Type">
//                             <select


//                                 className={inputClass}
//                             >
//                                 {SERVICE_TYPES.map((s) => (
//                                     <option key={s} value={s}>{s}</option>
//                                 ))}
//                             </select>
//                         </DrawerField>
//                     </div>

//                     <DrawerField label="Weather">
//                         <select


//                             className={inputClass}
//                         >
//                             <option value="">— select —</option>
//                             {WEATHER_OPTIONS.map((w) => (
//                                 <option key={w} value={w}>{w}</option>
//                             ))}
//                         </select>
//                     </DrawerField>

//                     {/* Special event toggle */}
//                     <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/30 border border-border rounded-lg">
//                         <input
//                             type="checkbox"
//                             id="special"
//                             checked={form.is_special_event}
//                             onChange={(e) => set("is_special_event", e.target.checked)}
//                             className="w-4 h-4 cursor-pointer accent-primary"
//                         />
//                         <label htmlFor="special" className="text-sm text-foreground cursor-pointer select-none">
//                             Mark as special event
//                         </label>
//                     </div>

//                     {form.is_special_event && (
//                         <DrawerField label="Event Name">
//                             <input
//                                 value={form.special_event_name}
//                                 onChange={(e) => set("special_event_name", e.target.value)}
//                                 placeholder="e.g. Easter Sunday"
//                                 className={inputClass}
//                             />
//                         </DrawerField>
//                     )}

//                     <div className="h-px bg-border" />

//                     <DrawerField label="Preacher">
//                         <input
//                             value={form.preacher}
//                             onChange={(e) => set("preacher", e.target.value)}
//                             placeholder="Name of preacher"
//                             className={inputClass}
//                         />
//                     </DrawerField>

//                     <DrawerField label="Sermon Title">
//                         <input
//                             value={form.sermon}
//                             onChange={(e) => set("sermon", e.target.value)}
//                             placeholder="Sermon title"
//                             className={inputClass}
//                         />
//                     </DrawerField>

//                     <DrawerField label="Key Scriptures">
//                         <input
//                             value={form.scriptures}
//                             onChange={(e) => set("scriptures", e.target.value)}
//                             placeholder="e.g. John 3:16, Ps 23"
//                             className={inputClass}
//                         />
//                     </DrawerField>

//                     <DrawerField label="Notes">
//                         <textarea
//                             value={form.notes}
//                             onChange={(e) => set("notes", e.target.value)}
//                             placeholder="Any additional notes…"
//                             rows={3}
//                             className={`${inputClass} resize-y leading-relaxed`}
//                         />
//                     </DrawerField>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-7 pb-7 pt-4 border-t border-border flex flex-col gap-2.5">
//                     <button className="w-full bg-primary text-primary-foreground font-bold text-sm rounded-lg py-3 cursor-pointer tracking-wide hover:bg-primary/90 transition-colors">
//                         Save Changes
//                     </button>

//                     <div className="flex gap-2">
//                         <button
//                             onClick={onClose}
//                             className="flex-1 bg-transparent text-muted-foreground border border-border rounded-lg py-2.5 text-sm cursor-pointer hover:text-foreground hover:border-foreground/30 transition-colors"
//                         >
//                             Cancel
//                         </button>

//                         <button onClick={() => { onDelete(row?.id); onClose(); }}
//                             className={cn("flex-1 bg-transparent text-red-400 border border-red-900/40 rounded-lg py-2.5 text-sm cursor-pointer hover:bg-red-400/8 transition-colors")}
//                         >
//                             Delete Record
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }