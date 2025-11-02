// "use client"

// import React from "react"
// import { toast } from "sonner"
// import { AuthData } from "../../types/auth-data"
// import { checkUserEmail } from "../../services"
// import { EmailSchema } from "../../schemas/login"
// import { AuthFooter } from "../components/Footer"
// import { EmailStep } from "../components/EmailStep"
// import { Separator } from "@/components/ui/separator"
// import { InfoBanner } from "../../components/InfoBanner"
// import { PasswordStep } from "../components/PasswordStep"
// import { normalizeEmail } from "@/features/auth/utils/normalize-email"

// export function Login() {
//     const [data, setData] = React.useState<AuthData>()
//     const [email, setEmail] = React.useState<string>("")
//     const [loading, setPending] = React.useState<boolean>(false)
//     const [isValidUser, setIsValidUser] = React.useState<boolean>(false)
//     const [formErrors, setFormErrors] = React.useState<{ email?: string[] } | null>(null)

//     async function handleCheck() {
//         setPending(true)
//         const rawEmail = normalizeEmail(email)

//         const validatedFields = EmailSchema.safeParse({
//             email: rawEmail,
//         })

//         if (!rawEmail.includes("cfi.church")) {
//             if (!validatedFields.success || !rawEmail.includes("cfi.church")) {
//                 const zodErrors = validatedFields.success ? {}
//                     : validatedFields.error.flatten().fieldErrors

//                 setFormErrors({
//                     ...zodErrors,
//                     email: [
//                         ...(zodErrors.email || []),
//                         ...(email.includes("cfi.church") ? [] :
//                             ["Please enter a valid CFI Workspace ID"]),
//                     ],
//                 })

//                 setPending(false)

//                 toast("Please enter a valid CFI Workspace ID")
//                 return
//             }
//         }

//         if (validatedFields.success) {
//             const user = await checkUserEmail({ email: rawEmail })
//             if ("user" in user) {
//                 setData(user)
//                 setPending(false)
//                 setIsValidUser(true)
//             } else {
//                 toast.error(user.error || "An error occurred.")
//             }
//         }

//         setPending(false)
//     }

//     function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
//         if (e.key === "Enter" && !loading && email.length > 0) {
//             handleCheck()
//         }
//     }

//     return (
//         <div className="px-3 lg:p-0 w-full h-[calc(100dvh-3rem)] relative flex justify-center">
//             <Separator className="hidden w-full absolute inset-x-0 top-12" />
//             <Separator orientation="vertical" className="w-full absolute inset-y-0 left-1/2 -translate-x-1/2 data-[orientation=vertical]:h-dvh z-10 hidden" />

//             <InfoBanner />
            

//             <div className="w-full flex justify-center items-center gap-x-20">
//                 {/* <Hero /> */}

//                 {/* <Separator 
//                     orientation="vertical" 
//                     className="hidden lg:block data-[orientation=vertical]:h-2/3 data-[orientation=vertical]:w-[1px] rounded-full bg-zinc-300 dark:bg-neutral-800" 
//                 /> */}
                
//                 {!isValidUser ? (
//                     <EmailStep
//                         email={email}
//                         onChange={setEmail}
//                         onClick={handleCheck}
//                         onKeyDown={handleKeyDown}
//                         loading={loading}
//                         error={formErrors?.email?.[0] ?? ""}
//                     />
//                 ) : (
//                     <PasswordStep
//                         data={{ user: data?.user }}
//                         email={email}
//                     />
//                 )}
//             </div>

//             <AuthFooter />
//         </div>
//     )
// }

// {/* <blockquote className="mt-2 hidden text-blue-200 text-sm">
//     Whatever you do, work at it with all your heart, as working for the Lord, not for <br />human masters. – Colossians 3:23 (NIV)
// </blockquote> */}



