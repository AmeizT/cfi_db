// import React from "react"
// import Link from "next/link"
// import { toast } from "sonner"
// import { FormButton } from "./Button"
// import { User } from "../../types/user"
// import { PasswordInput } from "./PasswordInput"
// import { createSession } from "../../actions"
// import { Flex } from "@/components/ui/box"
// import { AuthFormState } from "../../types/form-state"
// import { AnimatePresence, motion } from "motion/react"
// import { normalizeEmail } from "../../utils/normalize-email"
// import { Spinner } from "@/components/ui/spinner"
// import { Text } from "@/components/ui/text"
// import { useTranslations } from "next-intl"

// interface PasswordStepProps {
//     data: { user: User | undefined }
//     email: string
// }

// const initialFormState: AuthFormState = {
//     data: {
//         user: undefined,
//         error: "",
//     },
//     message: "",
//     httpStatusCode: -1,
//     success: false,
// }

// export function PasswordStep({ data, email }: PasswordStepProps){
//     const t = useTranslations("Password")
//     const [password, setPassword] = React.useState<string>("")
//     const [formState, formAction, pending] = React.useActionState(
//         createSession as (
//             prevState: AuthFormState,
//             formData: FormData
//         ) => Promise<AuthFormState>, 
//         initialFormState
//     )

//     React.useEffect(() => {
//         const handleFormState = () => {
//             if (formState?.httpStatusCode !== -1 && formState?.httpStatusCode !== 200) {
//                 toast.error(formState?.data?.error || "Identity verification failed.")
//             }
//         }

//         handleFormState()
//     }, [formState?.data?.error, formState?.httpStatusCode, formState])

//     return (
//         <Flex className="w-full">
//             <form action={formAction} className="px-6 lg:px-0 w-full lg:w-1/4 flex flex-col">
//                 <fieldset hidden>
//                     <input
//                         hidden
//                         name="email"
//                         type="email"
//                         defaultValue={normalizeEmail(email)}
//                         tabIndex={-1}
//                         readOnly
//                         aria-hidden={true}
//                         autoComplete="email"
//                     />

//                     <label hidden htmlFor="email">
//                         <span className="sr-only">
//                             Workspace ID or Username
//                         </span>
//                     </label>
//                 </fieldset>

//                 <PasswordInput
//                     data={{ user: data?.user }}
//                     password={password}
//                     setPassword={setPassword}
//                 />

//                 <AnimatePresence>
//                     <Flex asChild direction="column" gap={4} className="min-h-20">
//                         <motion.div>
//                             {password.length >= 8 ? (
//                                 <motion.div
//                                     className="mt-2 w-full"
//                                     initial={{ opacity: 0, y: 12, transformPerspective: 1000, translateZ: -5 }}
//                                     animate={{ opacity: 1, y: 0, translateZ: 0 }}
//                                     exit={{ opacity: 0, y: -12, translateZ: -5 }}
//                                     transition={{ type: "spring", bounce: 0.6, duration: 0.9, ease: "easeInOut" }}
//                                 >
//                                     <FormButton
//                                         type="submit"
//                                         disabled={pending || password.length < 8}
//                                     >
//                                         {pending ? (
//                                             <span className="flex items-center gap-x-2">
//                                                 <Spinner size="size-5.5" className="bg-white" /> <Text variant="shine" className="text-[0.9375rem] font-semibold bg-[linear-gradient(110deg,#93c5fd,35%,#fff,50%,#93c5fd,75%,#93c5fd)] dark:bg-[linear-gradient(110deg,#93c5fd,35%,#fff,50%,#93c5fd,75%,#93c5fd)]">
//                                                     {t("pending")}
//                                                 </Text>
//                                             </span>
//                                         ) : t("action")}
//                                     </FormButton>
//                                 </motion.div>
//                             ) : (
//                                 <motion.small
//                                     initial={{ opacity: 0, y: 0 }}
//                                     animate={{ opacity: 1, y: 8 }}
//                                     exit={{ opacity: 0, y: 0 }}
//                                     transition={{ type: "spring", bounce: 0.6, duration: 0.9, ease: "easeInOut" }}
//                                     className="block text-[13px] text-center text-body-muted text-balance font-normal"
//                                 >
//                                     {t("warningText")}
//                                 </motion.small>
//                             )}

//                             <Link className="text-sm text-center hover:underline underline-offset-2 font-medium dark:text-white" href="/en/auth/password/recover">
//                                 {t("reset-password")}
//                             </Link>
//                         </motion.div>
//                     </Flex>
//                 </AnimatePresence>                
//             </form>
//         </Flex>
//     )
// }