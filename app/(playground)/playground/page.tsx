"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/ui/form-input"

const welcomeBackLanguages = [
    "Welcome Back",
    "Bienvenue",
    "Bem-vindo de volta",
    "Kinyarwanda",
    "Kazakh",
    "Добро пожаловать",
    "हमेशा स्वागत है",
    "欢迎回来",
    "مرحبا بعودتك",
    "Selamat Kembali",
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
        },
    },
}

const ScrollingTextRow = ({ texts, duration = 30 }: { texts: string[]; duration?: number }) => {
    return (
        <div className="absolute w-full h-24 flex items-center overflow-hidden pointer-events-none">
            <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={{ x: ["0%", "-66.666%"] }}
                transition={{
                    duration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
            >
                {/* First set of texts */}
                <div className="flex gap-8">
                    {texts.map((text, index) => (
                        <div key={`first-${index}`} className="relative">
                            <span className="text-8xl font-black text-slate-300/70 whitespace-nowrap">{text}</span>
                            {/* Fade out gradient */}
                            <div className="hidden absolute inset-0 bg-linear-to-r from-transparent via-transparent to-slate-50 pointer-events-none" />
                        </div>
                    ))}
                </div>
                {/* Second duplicate set for seamless loop */}
                <div className="flex gap-8">
                    {texts.map((text, index) => (
                        <div key={`second-${index}`} className="relative">
                            <span className="text-8xl font-extrabold text-slate-300/70 whitespace-nowrap">{text}</span>
                            <div className="hidden absolute inset-0 bg-linear-to-r from-transparent via-transparent to-slate-50 pointer-events-none" />
                        </div>
                    ))}
                </div>
                {/* Third duplicate set for seamless loop */}
                <div className="flex gap-8">
                    {texts.map((text, index) => (
                        <div key={`third-${index}`} className="relative">
                            <span className="text-8xl font-black text-slate-300/70 whitespace-nowrap">{text}</span>
                            <div className="hidden absolute inset-0 bg-linear-to-r from-transparent via-transparent to-slate-50 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default function LoginPage() {
    const [workspaceId, setWorkspaceId] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Add your login logic here
        setTimeout(() => setIsLoading(false), 2000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-2/5 w-full">
                    <ScrollingTextRow texts={welcomeBackLanguages} duration={80} />
                </div>
                <div className="absolute top-3/5 w-full">
                    <ScrollingTextRow texts={welcomeBackLanguages} duration={100} />
                </div>
            </div>

            {/* Login Form Card */}
            <motion.div
                className="relative z-10 w-full lg:w-1/4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Card Background */}
                <motion.div className="flex flex-col bg-slate-100 rounded-2xl shadow-2xl" variants={itemVariants}>
                    <div className="bg-card border border-slate-200 rounded-2xl p-8">
                        <div className="mb-8">
                            <motion.h1 className="text-2xl font-bold text-foreground mb-2" variants={itemVariants}>
                                Sign in to CFI Workspace
                            </motion.h1>
                            <motion.p className="text-muted-foreground text-sm" variants={itemVariants}>
                                Welcome back. Please sign in to continue
                            </motion.p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Workspace ID Input */}
                            <motion.div variants={itemVariants} className="relative">
                                <FormInput
                                    id={"username"}
                                    autoFocus
                                    autoComplete="username"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    type="text"
                                    className="" 
                                    label={"Username"}                                
                                />
                            </motion.div>

                            {/* Password Input */}
                            <motion.div variants={itemVariants} className="relative">
                                <FormInput
                                    id={"username"}
                                    autoFocus
                                    autoComplete="username"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    type="text"
                                    className=""
                                    label={"Password"}
                                />
                            </motion.div>

                            {/* Login Button */}
                            <motion.div variants={itemVariants}>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-theme hover:bg-theme-600 text-theme-foreground font-semibold py-3 rounded-lg transition-all"
                                >
                                    {isLoading ? (
                                        <motion.span
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            Signing in...
                                        </motion.span>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.p className="text-xs text-muted-foreground text-center mt-6" variants={itemVariants}>
                            By continuing to use CFI Workspace, you agree to our{" "}
                            <a href="#" className="underline hover:text-foreground transition-colors">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline hover:text-foreground transition-colors">
                                Privacy Policy
                            </a>
                            .
                        </motion.p>
                    </div>

                    <motion.div className="py-3 text-center" variants={itemVariants}>
                        <p className="text-sm">
                            Forgot you password?{" "}
                            <a href="#" className="text-theme font-semibold hover:underline transition-all">
                                Reset your password
                            </a>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}
