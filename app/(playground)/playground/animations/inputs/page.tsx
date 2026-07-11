"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"

// import { useState } from "react"
// import { Mail, ArrowRight, Check, Sparkles } from "lucide-react"
// import { CountingNumber } from "@/components/animate-ui/text/counting-number"

// interface CircularProgressGradientProps {
//     progress?: number
//     total?: number
// }

// export default function CircularProgressGradient({ progress = 0, total = 4 }: CircularProgressGradientProps) {
//     const [currentProgress, setCurrentProgress] = useState(progress)
//     const percentage = Math.round((currentProgress / total) * 100)

//     // SVG circle properties
//     const size = 180
//     const strokeWidth = 18
//     const radius = (size - strokeWidth) / 2
//     const circumference = 2 * Math.PI * radius
//     const offset = circumference - (percentage / 100) * circumference

//     // Dots instead of dashes
//     const dotCount = 26
//     const dotRadius = 2.6

//     const handleMarkCompleted = () => {
//         if (currentProgress < total) {
//             setCurrentProgress(currentProgress + 1)
//         }
//     }

//     const isComplete = currentProgress >= total

//     return (
//         <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-none border border-gray-200 p-8 flex items-center gap-10 max-w-3xl">
//             <div className="flex">
//                 <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
//                     <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 max-w-sm">
//                         <h2 className="text-gray-800 text-xl font-semibold mb-2">Gray Theme</h2>
//                         <p className="text-gray-600 mb-4">
//                             Clean, neutral, and works with nearly any accent color.
//                         </p>
//                         <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
//                             Action
//                         </button>
//                     </div>
//                 </div>

//                 <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
//                     <div className="bg-white shadow-md border border-slate-200 rounded-xl p-6 max-w-sm">
//                         <h2 className="text-slate-800 text-xl font-semibold mb-2">Slate Theme</h2>
//                         <p className="text-slate-600 mb-4">
//                             Slightly cooler tones that give a refined, modern touch.
//                         </p>
//                         <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition">
//                             Action
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             {/* Circular Progress */}
//             <div className="relative flex-shrink-0 shadow-none rounded-full">
//                 <svg width={size} height={size} className="transform -rotate-90 relative z-10">
//                     {/* Define gradients */}
//                     <defs>
//                         <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                             <stop offset="0%" stopColor="#3B82F6" />
//                             <stop offset="50%" stopColor="#2563EB" />
//                             <stop offset="100%" stopColor="#1D4ED8" />
//                         </linearGradient>

//                         <linearGradient id="completeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                             <stop offset="0%" stopColor="#10B981" />
//                             <stop offset="50%" stopColor="#059669" />
//                             <stop offset="100%" stopColor="#047857" />
//                         </linearGradient>
//                     </defs>

//                     {/* Background track */}
//                     <circle
//                         cx={size / 2}
//                         cy={size / 2}
//                         r={radius}
//                         fill="none"

//                         strokeWidth={strokeWidth}
//                         opacity="0.3"
//                         className="stroke-gray-200"
//                     />

//                     {/* Dotted background pattern */}
//                     {Array.from({ length: dotCount }).map((_, i) => {
//                         const angle = (i / dotCount) * 2 * Math.PI
//                         const dotX = size / 2 + radius * Math.cos(angle)
//                         const dotY = size / 2 + radius * Math.sin(angle)
//                         const isInProgress = (i / dotCount) * 100 <= percentage

//                         return (
//                             <circle
//                                 key={i}
//                                 cx={dotX}
//                                 cy={dotY}
//                                 r={dotRadius}
//                                 // fill={isInProgress ? (isComplete ? "#10B981" : "#3B82F6") : "#D1D5DB"}

//                                 style={{
//                                     opacity: isInProgress ? 0.6 : 0.3,
//                                     transitionDelay: `${i * 10}ms`
//                                 }}
//                                 className={`${isInProgress ? (isComplete ? "fill-[#10B981]" : "fill-[#3B82F6]") : "fill-gray-400"} transition-all duration-500`}
//                             />
//                         )
//                     })}

//                     {/* Progress arc with gradient */}
//                     <circle
//                         cx={size / 2}
//                         cy={size / 2}
//                         r={radius}
//                         fill="none"
//                         stroke={isComplete ? "url(#completeGradient)" : "url(#progressGradient)"}
//                         strokeWidth={strokeWidth}
//                         strokeDasharray={circumference}
//                         strokeDashoffset={offset}
//                         strokeLinecap="round"
//                         className="transition-all duration-700 ease-out"
//                     />
//                 </svg>

//                 {/* Center content with animation */}
//                 <div className="absolute inset-0 flex flex-col items-center justify-center">
//                     {isComplete && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                             <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center animate-pulse">
//                                 <Check className="w-8 h-8 text-white" strokeWidth={3} />
//                             </div>
//                         </div>
//                     )}
//                     {!isComplete && (
//                         <>
//                             <div className="text-3xl font-geist font-bold bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent transition-all duration-500">
//                                 <CountingNumber number={percentage} />%
//                             </div>
//                             <div className="text-sm text-gray-400 mt-1 font-medium">
//                                 {currentProgress} of {total}
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>

//             {/* Profile completion section */}
//             <div className="flex flex-col gap-5 flex-1">
//                 <div>
//                     <div className="flex items-center gap-2 mb-2">
//                         <h3 className="text-xl font-bold text-slate-900">Profile Completion</h3>
//                         {isComplete && (
//                             <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200">
//                                 <Sparkles className="w-3 h-3 text-emerald-600" />
//                                 <span className="text-xs font-semibold text-emerald-700">Complete!</span>
//                             </div>
//                         )}
//                     </div>
//                     <p className="text-sm text-slate-600">
//                         {isComplete ? "All steps completed successfully" : "Complete these required steps:"}
//                     </p>
//                 </div>

//                 {!isComplete && (
//                     <>
//                         <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 transition-all hover:shadow-md">
//                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
//                                 <Mail className="w-5 h-5 text-white" />
//                             </div>
//                             <div className="flex-1">
//                                 <div className="text-sm font-semibold text-slate-900">Verify email address</div>
//                                 <div className="text-xs text-slate-600">Check your inbox for verification link</div>
//                             </div>
//                         </div>

//                         <button
//                             onClick={handleMarkCompleted}
//                             disabled={currentProgress >= total}
//                             className="group relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-900 hover:to-black text-white rounded-xl px-6 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
//                         >
//                             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                             <div className="relative flex items-center justify-center gap-2">
//                                 <Check className="w-5 h-5" />
//                                 <span>Mark as Completed</span>
//                             </div>
//                         </button>
//                     </>
//                 )}

//                 {!isComplete && (
//                     <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200">
//                         <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-slate-200">
//                             <ArrowRight className="w-4 h-4 text-slate-600" />
//                         </div>
//                         <div className="text-sm">
//                             <span className="text-slate-600">Next step: </span>
//                             <span className="font-semibold text-slate-900">Add company details</span>
//                         </div>
//                     </div>
//                 )}

//                 {isComplete && (
//                     <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
//                         <div className="flex items-start gap-3">
//                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
//                                 <Sparkles className="w-5 h-5 text-white" />
//                             </div>
//                             <div>
//                                 <div className="text-sm font-semibold text-emerald-900 mb-1">Profile is complete!</div>
//                                 <div className="text-xs text-emerald-700">You can now access all features and start using the platform.</div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }



import { Save, Copy, MoreHorizontal, Share2, Trash2 } from "lucide-react"

function ExpandableToolbar() {
    const [isExpanded, setIsExpanded] = useState(false)

    const handleSave = () => console.log("Save clicked")
    const handleCopy = () => console.log("Copy clicked")
    const handleShare = () => console.log("Share clicked")
    const handleDelete = () => console.log("Delete clicked")

    return (
        <div className="w-full flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
            <motion.div
                layout
                transition={{
                    type: "spring",
                    stiffness: 250, // stronger bounce
                    damping: 18, // less damping → more elasticity
                    mass: 0.7, // slightly lighter
                    duration: 0.4,
                }}
                className="relative"
            >
                <motion.div

                    className="flex items-center gap-1 rounded-full bg-white px-2 py-2 shadow-lg border border-slate-200"
                >
                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200 whitespace-nowrap"
                    >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                    </button>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200 whitespace-nowrap"
                    >
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                    </button>

                    {/* Expanded Buttons */}
                    <motion.div
                        layout
                        animate={{
                            width: isExpanded ? "auto" : "16px",
                            opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 18,
                            mass: 1,
                        }}
                        className="flex items-center gap-1 overflow-hidden"
                    >
                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200 whitespace-nowrap"
                            style={{
                                transform: isExpanded ? "scale(1)" : "scale(0.6)",
                                opacity: isExpanded ? 1 : 0,
                                transformOrigin: "center",
                                // Slight delay for smoother sequence with spring
                                transition: isExpanded
                                    ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.18s, opacity 0.4s ease-out 0.18s"
                                    : "transform 0.3s ease-in 0s, opacity 0.3s ease-in 0s",
                            }}
                        >
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 whitespace-nowrap"
                            style={{
                                transform: isExpanded ? "scale(1)" : "scale(0.6)",
                                opacity: isExpanded ? 1 : 0,
                                transformOrigin: "center",
                                // Small stagger after Share
                                transition: isExpanded
                                    ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.22s, opacity 0.4s ease-out 0.22s"
                                    : "transform 0.3s ease-in 0s, opacity 0.3s ease-in 0s",
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </button>
                    </motion.div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="rounded-full p-2 hover:bg-slate-100 transition-all duration-200 relative"
                    >
                        <div className="relative w-5 h-5">
                            <MoreHorizontal
                                className="h-5 w-5 text-slate-700 absolute inset-0 transition-opacity duration-300"
                                style={{ opacity: isExpanded ? 1 : 1 }}
                            />
                            {/* <X
                                className="h-5 w-5 text-slate-700 absolute inset-0 transition-opacity duration-300"
                                style={{ opacity: isExpanded ? 1 : 0 }}
                            /> */}
                        </div>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    )
}





import { Activity, useState } from "react"
import { ArrowLeft, ArrowRight, Mail, Lock } from "lucide-react"
import { motion } from "motion/react"
import React from "react"
import { EditorDialog } from "@/features/editor/containers/EditorDialog"

export default function StackedLoginInputs() {
    const [stage, setStage] = useState<"email" | "password">("email")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleNext = () => setStage("password")

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email.trim()) {
            setStage("password")
        }
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Login:", { email, password })
    }

    const handleBack = () => {
        setStage("email")
        setPassword("")
    }

    const isPasswordStage = stage === "password"

    return (
        <div className="w-full flex flex-col min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-6">
            <ExpandableToolbar />
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Invite a friend</h1>

                <div className="relative h-[200px]">
                    <motion.div
                        className="absolute inset-x-0 top-0"
                        animate={{
                            y: isPasswordStage ? -8 : 0,
                            scale: isPasswordStage ? 0.95 : 1,
                            opacity: isPasswordStage ? 0.6 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8,
                        }}
                        style={{
                            transformOrigin: "top center",
                            pointerEvents: isPasswordStage ? "none" : "auto",
                        }}
                    >
                        <form onSubmit={handleEmailSubmit}>
                            <div className="relative">
                                <div className="hidden absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email or username"
                                    className="w-full px-4 py-4 text-lg rounded-xl border-2 border-slate-200 bg-white focus:border-slate-900 focus:outline-none transition-colors duration-200"
                                    autoFocus
                                />
                            </div>
                        </form>
                    </motion.div>

                    <motion.div
                        className="absolute inset-x-0 top-0"
                        initial={{ y: 50, scale: 0.9, opacity: 0 }}
                        animate={{
                            y: isPasswordStage ? 0 : 50,
                            scale: isPasswordStage ? 1 : 0.9,
                            opacity: isPasswordStage ? 1 : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                            mass: 0.75,
                        }}
                        style={{
                            transformOrigin: "left center",
                            pointerEvents: isPasswordStage ? "auto" : "none",
                        }}
                    >
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-12 py-4 text-lg rounded-xl border-2 border-slate-200 bg-white focus:border-slate-900 focus:outline-none transition-colors duration-200 shadow-lg"
                                    autoFocus={stage === "password"}
                                />
                            </div>
                        </form>
                    </motion.div>
                </div>

                <div className="relative mt-8 flex items-center justify-center w-full">
                    <motion.button
                        onClick={handleBack}
                        className="absolute left-0 w-14 h-14 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                        initial={{ opacity: 0, scale: 0.5, x: -20 }}
                        animate={{
                            opacity: isPasswordStage ? 1 : 0,
                            scale: isPasswordStage ? 1 : 0.5,
                            x: isPasswordStage ? 0 : -20,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                            mass: 0.7,
                        }}
                        style={{
                            pointerEvents: isPasswordStage ? "auto" : "none",
                        }}
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </motion.button>

                    <motion.button
                        onClick={isPasswordStage ? handlePasswordSubmit : handleNext}
                        className="absolute bg-slate-900 hover:bg-black text-white font-semibold h-14 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl overflow-hidden px-8 right-0"
                        layout
                        animate={{
                            width: isPasswordStage ? "50%" : "100%",
                            x: isPasswordStage ? "50%" : "0%",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                            layout: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                mass: 0.8,
                            },
                            width: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                mass: 0.8,
                            },
                            x: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                mass: 0.8,
                            },
                        }}
                    >
                        <motion.span
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                            }}
                        >
                            Next
                        </motion.span>
                        <motion.div
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                            }}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </motion.div>
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

import { Drawer } from "vaul"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Calendar02Icon, HandPrayerIcon, Invoice04Icon, PurseIcon } from "@hugeicons/core-free-icons"

const data = {
    report: [
        { name: "Attendance", icon: Calendar02Icon },
        { name: "Expenses", icon: Invoice04Icon },
        { name: "Income", icon: PurseIcon },
        { name: "Tithes", icon: HandPrayerIcon },
    ],
    entries: [
        { name: "Assets", icon: Invoice04Icon },
        { name: "Groups", icon: Invoice04Icon },
        { name: "Meetings", icon: Calendar02Icon },
        { name: "Member", icon: PurseIcon },
        { name: "Request", icon: HandPrayerIcon },
    ],

}

// export function VaulDrawer() {
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     const Mode = {
//         REPORTS: "reports",
//         ENTRIES: "entries",
//     } as const;

//     type ModeType = typeof Mode[keyof typeof Mode];

//     const mode = (searchParams.get("mode") as ModeType) ?? Mode.REPORTS;

//     const setQuery = React.useCallback(
//         (name: string, value: string) => {
//             const params = new URLSearchParams(searchParams.toString());
//             params.set(name, value);
//             return params.toString();
//         },
//         [searchParams]
//     );

//     const toggleMode = () => {
//         const nextMode = mode === Mode.REPORTS ? Mode.ENTRIES : Mode.REPORTS;
//         router.push(`/playground/animations/inputs?${setQuery("mode", nextMode)}`);
//     };

//     const items = mode === Mode.REPORTS ? data.report : data.entries;

//     return (
//         <Drawer.Root direction="right">
//             <Drawer.Trigger className="relative flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
//                 Open Drawer
//             </Drawer.Trigger>
//             <Drawer.Portal>
//                 <Drawer.Overlay className="fixed inset-0 bg-black/40" />
//                 <Drawer.Content className="w-3/5 flex flex-col h-dvh fixed bottom-0 right-0 outline-none">
//                     <Drawer.Title className="sr-only">Editor</Drawer.Title>
//                     <div className="w-full h-full bg-yellow-500 rounded-tl-2xl rounded-bl-2xl flex flex-col flex-1 min-h-0">
//                         <SidebarProvider className="min-h-0">
//                             <Sidebar collapsible="none" className="hidden md:flex rounded-tl-2xl rounded-bl-2xl bg-slate-50 border-r border-slate-100">
//                                 <SidebarHeader>
//                                     <Button onClick={toggleMode}>
//                                         {mode}
//                                     </Button>
//                                 </SidebarHeader>

//                                 <SidebarContent>
//                                     <SidebarGroup>
//                                         <SidebarGroupContent>
//                                             <SidebarMenu>
//                                                 {items.map((item) => (
//                                                     <SidebarMenuItem key={item.name}>
//                                                         <SidebarMenuButton
//                                                             asChild
//                                                             isActive={item.name === "Messages & media"}
//                                                         >
//                                                             <a href="#">
//                                                                 <HugeiconsIcon icon={item.icon} />
//                                                                 <span>{item.name}</span>
//                                                             </a>
//                                                         </SidebarMenuButton>
//                                                     </SidebarMenuItem>
//                                                 ))}
//                                             </SidebarMenu>
//                                         </SidebarGroupContent>
//                                     </SidebarGroup>
//                                 </SidebarContent>

//                                 <Activity mode={mode?.includes("report") ? "visible" : "hidden"}>
//                                     <SidebarFooter>
//                                         footer progress bar
//                                     </SidebarFooter>
//                                 </Activity>
//                             </Sidebar>
//                             <main className="flex flex-1 min-h-0 flex-col overflow-y-auto bg-white">
//                                 <header className="flex h-16 shrink-0 items-center gap-2 px-4">
//                                     header
//                                 </header>

//                                 <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-4 pt-0">
//                                     {Array.from({ length: 10 }).map((_, i) => (
//                                         <div key={i} className="bg-muted/50 aspect-video max-w-3xl rounded-xl" />
//                                     ))}
//                                 </div>
//                             </main>
//                         </SidebarProvider>
//                     </div>
//                 </Drawer.Content>
//             </Drawer.Portal>
//         </Drawer.Root>
//     );
// }
