export type FormActionState<TErrors = Record<string, string>> = {
    message: string
    status: number
    success: boolean
    errors: TErrors
}