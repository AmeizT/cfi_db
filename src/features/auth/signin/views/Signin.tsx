// "use client"

// import React from "react"
// import { AuthData } from "../../types/auth-data"
// import { Flex } from "@/components/ui/box"
// import { AuthFooter } from "../../login/components/Footer"
// import { EmailStep } from "../../login/components/EmailStep"
// import { PasswordStep } from "../../login/components/PasswordStep"
// import { usePathname, useRouter, useSearchParams } from "next/navigation"

// export default function LoginView() {
//     const router = useRouter()
//     const pathname = usePathname()
//     const searchParams = useSearchParams()
//     const [email, setEmail] = React.useState<string>("")
//     const [data, setData] = React.useState<AuthData>()
//     const isValidUser = data?.user ?? false
//     const isVerificationStage = searchParams.get("stage") === "verification"

//     const createQueryString = React.useCallback(
//         (name: string, value: string) => {
//             const params = new URLSearchParams(searchParams.toString())
//             params.set(name, value)

//             return params.toString()
//         },
//         [searchParams]
//     )

//     // React.useEffect(() => {
//     //     if (isValidUser) {
//     //         router.push(`${pathname}?${ createQueryString("stage", "authentication") }`)
//     //     } else {
//     //         router.push(`${pathname}?${createQueryString("stage", "verification")}`)
//     //     }
//     // }, [createQueryString, pathname, isValidUser, router])

//     React.useEffect(() => {
//         const currentStage = searchParams.get("stage")

//         // Respect manual navigation: only redirect if no stage is present
//         // or the stage is inconsistent with the user's status
//         if (!currentStage) {
//             const targetStage = isValidUser ? "authentication" : "verification"
//             router.replace(`${pathname}?${createQueryString("stage", targetStage)}`)
//             return
//         }

//         // If a stage exists, only fix it if it’s clearly incorrect
//         if (isValidUser && currentStage !== "authentication") {
//             router.replace(`${pathname}?${createQueryString("stage", "authentication")}`)
//         } else if (!isValidUser && currentStage !== "verification") {
//             router.replace(`${pathname}?${createQueryString("stage", "verification")}`)
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [isValidUser])

//     return (
//         <Flex direction="column" justify="center" align="center" className="h-dvh">
//             {isVerificationStage ? (
//                 <EmailStep
//                     data={data}
//                     email={email}
//                     setEmail={setEmail}
//                     setData={setData}
//                 />
//             ) : (
//                 <PasswordStep
//                     data={{ user: data?.user }}
//                     email={email}
//                 />
//             )}

//             <AuthFooter />
//         </Flex>
//     )
// }


