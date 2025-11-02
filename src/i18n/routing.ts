import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
    locales: ['en', 'fr', 'pt', 'sw', 'af'],

    defaultLocale: 'en'
})