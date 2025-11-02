import React from "react"
import { Flex } from "@/components/ui/box"
import { User } from "@/features/auth/types/user"
import { greetByTime } from "@/utils/greet-by-time"
import { FormInput } from "@/components/ui/form-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations } from "next-intl"

interface PasswordInputProps {
    password: string
    setPassword: React.Dispatch<React.SetStateAction<string>>
    data: {
        user: User | undefined
    }
}

export function PasswordInput({ data, password, setPassword }: PasswordInputProps){
    const t = useTranslations("Password")

    return (
        <Flex direction="column" gap={6}>
            <Flex direction="column" gap={4}>
                <Avatar className="size-20">
                    <AvatarImage src={data?.user?.avatar || undefined} alt={data?.user?.full_name} />
                    <AvatarFallback className="text-white text-xl font-medium" style={{ backgroundColor: `${data?.user?.avatar_fallback}`}}>
                        {data?.user?.first_name.charAt(0)}{data?.user?.last_name.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <h1 className="text-3xl tracking-tight font-semibold text-neutral-800 dark:text-white">
                    {greetByTime()} {data?.user?.first_name || data?.user?.username}
                </h1>

                <p className="text-center text-body-muted font-medium">
                    {t("title")}
                </p>
            </Flex>

            <Flex asChild direction="column" gap={2}>
                <fieldset className="w-full">
                    <FormInput
                        type="password"
                        name="password"
                        label={t("input")}
                        value={password}
                        onChange={(e: { target: { value: React.SetStateAction<string> } }) => setPassword(e.target.value)}
                        autoFocus
                        autoComplete="current-password"
                        className="w-full"
                    />
                </fieldset>
            </Flex>
        </Flex>
    )
}