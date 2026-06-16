"use client"

import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { FormButton } from "./Button"
import { Text } from "@/components/ui/text"
import { useStore } from "@tanstack/react-store"
import { Spinner } from "@/components/ui/spinner"
import { AuthFormState } from "../../types/form-state"
import { motion, AnimatePresence } from "motion/react"
import { workspaceLoginSchema } from "../../schemas/login"
import { normalizeEmail } from "../../utils/normalize-email"
import { useAppForm } from "@/features/editor/hooks/use-form"
import { createSessionClient } from "../../create-session-client"
import { useAuthTranslations } from "@/i18n/hooks/useAuthTranslations"
import { useRouter } from "next/navigation"

export const initialFormState = {
    success: false,
} satisfies AuthFormState


interface FormState {
    error?: string
    pending?: boolean
    success: boolean
}

export function AuthForm(){
    const router = useRouter()
    const { t } = useAuthTranslations()
    // const [formState, formAction, isPending] = React.useActionState(
    //     createSession as (
    //         prevState: AuthFormState,
    //         formData: FormData
    //     ) => Promise<AuthFormState>, 
    //     initialFormState
    // )

    const [formState, setFormState] = React.useState<FormState>({
        success: false,
    })
    
    const authForm = useAppForm({
        defaultValues: {
            username: "",
            password: "",
        },
        validators: {
            onSubmit: workspaceLoginSchema,
        },
        onSubmit: async ({ value }) => {
            setFormState({ pending: true, success: false })

            try {
                const resolvedEmail = normalizeEmail(value.username)

                const formData = new FormData()
                formData.append("email", resolvedEmail)
                formData.append("password", value.password)

                const res = await createSessionClient(formData)

                if (!res.success) {
                    setFormState({
                        pending: false,
                        success: false,
                        error: res.error || "Login failed",
                    })
                    return
                }

                setFormState({
                    pending: false,
                    success: true,
                })

                router.push("/app/dashboard")

            } catch (err) {
                console.error("Unexpected error:", err)

                setFormState({
                    pending: false,
                    success: false,
                    error: "Something went wrong",
                })
            }
        },
    })

    const { username = "", password = "" } = useStore(
        authForm.store,
        s => s.values
    )

    const canSubmit = username.trim() && password.length >= 8

    // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault()
    //     setFormState({ pending: true, success: false })

    //     const formData = new FormData(e.currentTarget)
    //     const username = formData.get("username") as string
    //     const password = formData.get("password") as string
    
    //     const email = normalizeEmail(username) 

    //     formData.append("email", email)
    //     formData.append("password", password)

    //     console.log("formData", formData.get("email"), formData.get("password"))

    //     const res = await createSessionClient(formData)

    //     if (res.success) {
    //         const isAuthenticated = await verifySession()

    //         if (isAuthenticated) {
    //             console.log("Session verified, redirecting to dashboard...")
    //             // router.push("/app/dashboard")
    //         } else {
    //             console.error("Session verification failed after login")
    //             setFormState({
    //                 pending: false,
    //                 success: false,
    //                 error: "Session verification failed"
    //             })
    //         }
    //     }

    //     setFormState({ pending: false, success: res.success })

    //     if (!res.success) {
    //         console.error(res.error || "Login failed")
    //         return setFormState({ 
    //             pending: false, 
    //             success: false, 
    //             error: res.error || "Login failed" 
    //         })
    //     }        
    // }

    React.useEffect(() => {
        console.log("state", authForm.state)
        if (formState?.error) {
            toast.error(formState?.error)
        }

        
    }, [authForm.state, formState])

    return (
        <div className="py-16 w-full flex-col items-center justify-center flex">
            <motion.div className="px-6 lg:p-0 w-full lg:w-3/5 flex flex-col justify-center">
                <div className="mb-6 flex flex-col gap-y-2">
                    <h3 className="text-2xl text-center text-mist-800 dark:text-body-muted font-semibold">
                        {t("heading")}
                    </h3>

                    <p className="text-sm text-center text-mist-500">
                        {t("tagline")}
                    </p>
                </div>

                <form 
                id={"login"}
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    authForm.handleSubmit()
                }}
                className="flex flex-col">
                    <motion.div
                        
                        initial={{ x: 0 }}
                        
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-y-4"
                    >
                        <authForm.AppField name="username">
                            {field => (
                                <field.FloatLabelInput
                                    id="username"
                                    type="string"
                                    label={t("fields.identifier")}
                                    autoFocus
                                    autoComplete="username"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                />
                            )}
                        </authForm.AppField>

                        <div className="hidden">
                            <input
                                type="email"
                                autoFocus
                                autoComplete="username"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                        </div>

                        <authForm.AppField name="password">
                            {field => (
                                <field.FloatLabelInput
                                    id="password"
                                    label={t("fields.password")}
                                    type="password"
                                    autoFocus
                                    autoComplete="current-password"
                                    minLength={8}
                                />
                            )}
                        </authForm.AppField>

                        <Link href="/en/auth/password/recover" aria-label="Reset your password" className="flex gap-2 items-center self-center font-medium text-sm text-mist-600 hover:text-mist-800 dark:text-white dark:hover:text-mist-300">
                            {t("links.forgotPassword")}
                        </Link>
                    </motion.div>

                    <AnimatePresence>
                        <div className="min-h-20">
                            <motion.div
                                className="mt-4"
                                initial={{ opacity: 0, y: 12, transformPerspective: 1000, translateZ: -5 }}
                                animate={{ opacity: 1, y: 0, translateZ: 0 }}
                                exit={{ opacity: 0, y: -12, translateZ: -5 }}
                                transition={{ type: "spring", bounce: 0.6, duration: 0.9, ease: "easeInOut" }}
                            >
                                <FormButton
                                    type="submit"
                                    disabled={formState.pending || !canSubmit}
                                >
                                    {formState.pending ? (
                                        <span className="flex items-center gap-x-2">
                                            <Spinner size="size-5.5" className="bg-white" /> <Text variant="shine" className="text-[0.9375rem] font-semibold bg-[linear-gradient(110deg,#6b7280,35%,#fff,50%,#6b7280,75%,#6b7280)] dark:bg-[linear-gradient(110deg,#6b7280,35%,#fff,50%,#6b7280,75%,#6b7280)]">
                                                {t("actions.loading")}
                                            </Text>
                                        </span>
                                    ) : `${t("actions.submit")}`}
                                </FormButton>
                            </motion.div>
                            
                            <motion.small
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: 1, y: 8 }}
                                exit={{ opacity: 0, y: 0 }}
                                transition={{ type: "spring", bounce: 0.6, duration: 0.9, ease: "easeInOut" }}
                                className="block text-[13px] text-center text-mist-500 text-balance font-normal"
                            >
                                {t.rich("legal.notice", {
                                    Link: (chunks) => (
                                        <Link href="/tos" className="text-mist-800 font-semibold hover:text-neutral-700 dark:hover:text-white">
                                            {chunks}
                                        </Link>
                                    ),
                                })}
                            </motion.small>

                            <motion.div 
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: 1, y: 8 }}
                                exit={{ opacity: 0, y: 0 }}
                                transition={{ type: "spring", bounce: 0.6, duration: 0.9, ease: "easeInOut" }}
                                className="mt-4 p-4 w-full bg-linear-to-b from-white to-white rounded-2xl backdrop-blur-lg shadow-card"
                            >
                                <small className="inline-block text-xs text-mist-500 font-normal leading-normal">
                                    {t.rich("sso.explanation", {
                                        strong: (chunks) => (
                                            <strong className="font-semibold text-mist-700 dark:text-mist-300">
                                                {chunks}
                                            </strong>
                                        ),
                                    })}
                                </small>
                            </motion.div>
                        </div>
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    )
}