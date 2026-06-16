"use client"

import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "../actions/reset-password"
import { AnimatePresence, motion } from "motion/react"
import { FormInput } from "@/components/ui/form-input"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"
import { FormButton } from "../login/components/Button"
import { normalizeEmail } from "../utils/normalize-email"
import { passwordRecoverySchema } from "../schemas/login"
import Container from "@/components/ui/container"

const initialState = {
    message: "",
    status: 0,
    success: false
}

export default function PasswordRecovery() {
    const router = useRouter()
    const t = useTranslations("Recover")
    const searchParams = useSearchParams()
    const [email, setEmail] = React.useState<string>("")
    const [formErrors, setFormErrors] = React.useState<{ email?: string[] } | null>(null)
    const isRecoveryInitialized = searchParams.get("initialize_recovery") === "true"
    const [formState, action, isPending] = React.useActionState(resetPassword, initialState)

    async function formAction(formData: FormData) {
        const normalizedEmail = normalizeEmail(email)

        const validatedFields = passwordRecoverySchema.safeParse({
            email: normalizedEmail,
        })

        if (!normalizedEmail.includes("cfi.church")) {
            if (!validatedFields.success || !normalizedEmail.includes("cfi.church")) {
                const zodErrors = validatedFields.success ? {}
                    : validatedFields.error.flatten().fieldErrors

                setFormErrors({
                    ...zodErrors,
                    email: [
                        ...(zodErrors.email || []),
                        ...(email.includes("cfi.church") ? [] :
                            ["Please enter a valid CFI Workspace ID"]),
                    ],
                })

                toast("Please enter a valid CFI Workspace ID")

                return
            }
        }

        if (validatedFields.success) {
            setEmail(validatedFields.data?.email)
            formData.append("email", validatedFields.data?.email)
            await action(formData)
        }
    }

    React.useEffect(() => {
        if (formState.success) {
            const params = new URLSearchParams(searchParams.toString())
            params.set("initialize_recovery", "true")
            router.push(`/en/auth/password/recover?${params.toString()}`)
        }
    }, [formState, router, searchParams])

    return (
        <React.Fragment>
            {!isRecoveryInitialized ? (
                <Container>
                    <Container.Auth type="recovery">
                        <form 
                        action={formAction} 
                        className="w-full flex flex-col">
                            <motion.div
                                key={formErrors?.email?.[0] ? "error" : "no-error"}
                                initial={{ x: 0 }}
                                animate={formErrors?.email?.[0] ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col gap-0">

                                <FormInput
                                    id="email"
                                    autoFocus
                                    autoComplete="username"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    type="text"
                                    label={t("input")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={formErrors?.email?.[0]}
                                />
                            </motion.div>

                            <AnimatePresence>
                                <div className="min-h-20">
                                    {email.length >= 4 ? (
                                        <motion.div
                                            className="mt-2"
                                            initial={{ opacity: 0, y: 12, transformPerspective: 1000, translateZ: -5 }}
                                            animate={{ opacity: 1, y: 0, translateZ: 0 }}
                                            exit={{ opacity: 0, y: -12, translateZ: -5 }}
                                            transition={{ type: "spring", bounce: 0.6, duration: 0.9, ease: "easeInOut" }}
                                        >
                                            <FormButton
                                                type="submit"
                                                disabled={isPending}
                                            >
                                                {isPending ? (
                                                    <span className="flex items-center gap-x-2">
                                                        <Spinner size="size-5.5" className="bg-white" /> <Text variant="shine" className="text-[0.9375rem] font-semibold bg-[linear-gradient(110deg,#93c5fd,35%,#fff,50%,#93c5fd,75%,#93c5fd)] dark:bg-[linear-gradient(110deg,#93c5fd,35%,#fff,50%,#93c5fd,75%,#93c5fd)]">
                                                            {t("pending")}
                                                        </Text>
                                                    </span>
                                                ) : `${t("action")}`}
                                            </FormButton>
                                        </motion.div>
                                    ) : (
                                        <motion.small
                                            initial={{ opacity: 0, y: 0 }}
                                            animate={{ opacity: 1, y: 8 }}
                                            exit={{ opacity: 0, y: 0 }}
                                            transition={{ type: "spring", bounce: 0.6, duration: 0.9, ease: "easeInOut" }}
                                            className="block text-[13px] text-center text-body-muted text-balance leading-5"
                                        >

                                        </motion.small>
                                    )}
                                </div>
                            </AnimatePresence>
                        </form>
                    </Container.Auth>
                </Container>
            ) : (
                <RecoveryInitializedMessage />
            )}
        </React.Fragment>
    )
}

function RecoveryInitializedMessage() {
    const t = useTranslations("Initialize")

    return (
        <Container>
            <Container.Auth type="initialize-recovery">
                <div className="block content-center">
                    <Link href="/en/auth/login?stage=verification" className="py-2 px-4 text-sm dark:text-white font-semibold rounded-lg border dark:border-neutral-700 dark:bg-linear-to-b dark:from-neutral-800 dark:to-neutral-900 hover:bg-zinc-50 transition-colors duration-200">
                        {t("action")}
                    </Link>
                </div>
            </Container.Auth>
        </Container>
    )
}



