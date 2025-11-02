"use client"

import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { FormButton } from "./Button"
import { AuthData } from "../../types/auth-data"
import { EmailSchema } from "../../schemas/login"
import { Flex } from "@/components/ui/box"
import { FormInput } from "@/components/ui/form-input"
import { motion, AnimatePresence } from "framer-motion"
import { normalizeEmail } from "../../utils/normalize-email"
import { LocalizedWelcome } from "../../components/LocalizedWelcome"
import { useTranslations } from "next-intl"
import { AuthFormState } from "../../types/form-state"
import { verifyUserId } from "../../actions/verify-user-id"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"

// interface EmailStepProps {
//     email: string
//     onChange: (email: string) => void
//     onClick: () => void
//     onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
//     error?: string
//     loading: boolean
// }

interface EmailStepProps {
    email: string
    data: AuthData | undefined
    setEmail: React.Dispatch<React.SetStateAction<string>>
    setData: React.Dispatch<React.SetStateAction<AuthData | undefined>>
}

export const initialFormState: AuthFormState = {
    data: {
        user: undefined,
        error: ""
    },
    httpStatusCode: -1,
    message: "",
    success: false,
}

export function EmailStep({ email, setEmail, data, setData }: EmailStepProps){
    const t = useTranslations("Auth")
    const [state, action, isPending] = React.useActionState(
        verifyUserId as (
            prevState: AuthFormState,
            formData: FormData
        ) => Promise<AuthFormState>,
        initialFormState
    )
    const [formErrors, setFormErrors] = React.useState<{ email?: string[] } | null>(null)
    
    async function formAction(formData: FormData) {
        const normalizedEmail = normalizeEmail(email)

        const validatedFields = EmailSchema.safeParse({
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
        if (state.httpStatusCode === -1) return

        if (state.success) {
            setData({
                user: state.data.user as AuthData["user"],
            })
        } else {
            setData({
                user: undefined,
                error: state.data.error,
            })

            toast.error("Failed to verify your id")
        }
    }, [state, setData])

    return (
        <Flex className="py-16 w-full flex-col">
            <motion.div className="px-6 lg:p-0 w-full lg:w-1/4 flex flex-col justify-center">
                <div className="mb-6 flex flex-col gap-y-2">
                    <LocalizedWelcome />

                    <p className="text-base text-center text-gray-400 dark:text-body-muted font-medium">
                        {t("title")}
                    </p>
                </div>

                <form action={formAction} className="flex flex-col">
                    <motion.div
                        key={formErrors?.email?.[0] || data?.error ? "error" : "no-error"}
                        initial={{ x: 0 }}
                        animate={formErrors?.email?.[0] || data?.error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                    >
                        <FormInput
                            id={"username"}
                            autoFocus
                            autoComplete="username"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            type="text"
                            label={t("input")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={formErrors?.email?.[0] || data?.error}
                            className=""
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
                                        ) : `${t("cta")}`}
                                    </FormButton>
                                </motion.div>
                            ) : (
                                <motion.small
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 8 }}
                                    exit={{ opacity: 0, y: 0 }}
                                    transition={{ type: "spring", bounce: 0.6, duration: 0.9, ease: "easeInOut" }}
                                    className="block text-[13px] text-center text-body-muted text-balance font-normal leading-[1.25rem]"
                                >
                                    {t.rich("terms", {
                                        Link: (chunks) => (
                                            <Link href="/tos" className="underline underline-offset-2 hover:text-neutral-700 dark:hover:text-white">{chunks}</Link>
                                        ),
                                    })}
                                    {/* By continuing to use CFI Workspace, you agree to our <Link href="/tos" className="underline underline-offset-2 hover:text-neutral-700 dark:hover:text-white/80 transition-colors duration-300"><strong className="font-medium">Terms of Service</strong></Link> and Privacy Policy. */}
                                </motion.small>
                            )}
                        </div>
                    </AnimatePresence>
                </form>
            </motion.div>
        </Flex>
    )
}