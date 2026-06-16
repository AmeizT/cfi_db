import { useTypedTranslations } from "../utilis"

export const useAuthTranslations = () => {
    const { t, typed } = useTypedTranslations('Auth')

    return { t, auth: typed }
}