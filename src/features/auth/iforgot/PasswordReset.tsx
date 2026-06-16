/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { z } from "zod"
import React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { URLParamsProps } from "@/types/api"
import { useForm } from "react-hook-form"
import { Text } from "@/components/ui/text"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import { FormInput } from "@/components/ui/form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "motion/react"
import { FormButton } from "../login/components/Button"
import { createPassword } from "../actions/set-password"
import Container from "@/components/ui/container"

const initialState = {
    data: null,
    errors: null,
    status: 0,
    success: false
}

const resetPasswordSchema = z.object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    re_new_password: z.string()
}).refine((data) => data.new_password === data.re_new_password, {
    message: "Passwords do not match",
    path: ["re_new_password"]
})

export function PasswordReset({ params: { uid, token } }: URLParamsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const formRef = React.useRef<HTMLFormElement>(null)
    const reset = useTranslations("Reset")
    const base = useTranslations("Password")
    const isPasswordUpdated = searchParams.get("password_updated") === "true"
    const [formErrors, setFormErrors] = React.useState<any>(null)
    const [formState, action, isPending] = React.useActionState(createPassword, initialState)

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            new_password: "",
            re_new_password: "",
        },
    })

    async function formAction(formData: FormData) {
        formData.append("uid", uid as string)
        formData.append("token", token as string)
        await action(formData)
    }

    React.useEffect(() => {
        if (formState.success) {
            const params = new URLSearchParams(searchParams.toString())
            params.set("password_updated", "true")
            router.push(`/en/auth/password/reset/${uid}/${token}?${params.toString()}`)
        }

        router.prefetch("/en/auth/login/")

    }, [router, formState, searchParams, uid, token])

    React.useEffect(() => {
        setFormErrors(formState?.errors?.new_password || formState?.errors?.non_field_errors || null)
    }, [formState?.errors?.new_password, formState?.errors?.non_field_errors])

    return (
        <React.Fragment>
            {!isPasswordUpdated ? (
                <Container>
                    <Container.Auth type="reset">
                        <form
                        ref={formRef}
                        action={formAction}
                         
                        className="w-full flex flex-col gap-y-0">
                            <div className="flex flex-col gap-y-4">
                                {formErrors && (
                                    <div className="p-2 flex flex-col rounded-lg bg-red-500/10">
                                        {formErrors?.map((error: string, key: number) => (
                                            <span key={key} className="text-sm text-red-500">
                                                {error}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <fieldset className="flex flex-col gap-y-2">
                                    <FormInput
                                        id="pwd"
                                        type="password"
                                        {...form.register("new_password")}
                                        
                                        label={reset("input")}
                                        
                                        className="border-[1.25px]"
                                    />
                                    {form.formState.errors.new_password && <span className="text-red-500 text-sm">{form.formState.errors.new_password.message}</span>}

                                    <FormInput
                                        id="pwd2"
                                        type="password"
                                        {...form.register("re_new_password")}
                                        
                                        label={reset("input-2")}
                                        
                                        className="border-[1.25px]"
                                    />
                                    {form.formState.errors.re_new_password && <span className="text-red-500 text-sm">{form.formState.errors.re_new_password.message}</span>}
                                </fieldset>
                            </div>

                            <AnimatePresence>
                                <div className="min-h-20">
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
                                                        {reset("pending")}
                                                    </Text>
                                                </span>
                                            ) : `${base("action")}`}
                                        </FormButton>
                                    </motion.div>
                                </div>
                            </AnimatePresence>
                        </form>
                    </Container.Auth>
                </Container>
            ) : (
                <PasswordUpdatedMessage />
            )}
        </React.Fragment>
        
    )
}

function PasswordUpdatedMessage() {
    const t = useTranslations("PasswordUpdated")

    return (
        <Container>
            <Container.Auth type="password-updated">
                <div className="block content-center">
                    <Link href="/en/auth/login?stage=verification" className="py-2 px-4 text-sm dark:text-white font-semibold rounded-lg border dark:border-neutral-700 dark:bg-linear-to-b dark:from-neutral-800 dark:to-neutral-900 hover:bg-zinc-50 transition-colors duration-200">
                        {t("action")}
                    </Link>
                </div>
            </Container.Auth>
        </Container>
    )
}