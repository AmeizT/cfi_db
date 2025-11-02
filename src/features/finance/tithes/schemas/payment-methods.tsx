export const paymentMethods = [
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    { label: "Payment By Phone (PBP)", value: "Payment By Phone" },
    { label: "Other", value: "Other" },
] as const

export type PaymentMethod = typeof paymentMethods[number]["value"]
export type PaymentMethodOption = typeof paymentMethods[number]


