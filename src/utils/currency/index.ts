export function formatCurrency(
    language: string = "en-US",
    currency: string = "USD",
    amount: number
  ): string {
    if (isNaN(amount)) return ""
  
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
}