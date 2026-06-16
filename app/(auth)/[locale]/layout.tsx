import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { getMessages } from "next-intl/server"
import { getLayoutComponent } from "@/layouts/registry"
import { NextIntlClientProvider, hasLocale } from "next-intl"

const Document = getLayoutComponent("root")

interface RootLayoutProps {
    children: Readonly<React.ReactNode>
    params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
    const locales = ['en', 'es', 'fr']

    return locales.map((locale) => ({
        locale,
    }))
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
    const { locale } = await params
    const messages = await getMessages({ locale })

    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    return (
        <Document locale={locale}>
            <NextIntlClientProvider messages={messages}>
                <main className="relative">
                    {/* <div className="p-4 lg:p-6 fixed top-0 inset-x-0 flex justify-between items-center">
                        <ModeToggle />
                        <LocaleSwitcherDropdown locale={locale} />
                    </div> */}
                    {children}
                </main>
            </NextIntlClientProvider>
        </Document>
    )
}