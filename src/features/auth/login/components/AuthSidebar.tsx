"use client"

import React from "react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "motion/react"
import SplitText from "@/components/ui/split-text"
import { cn } from "@/lib/utils"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"

type TranslationItem = {
    code: string
    language: string
    message: string
    region?: string
    flag?: string
    rtl?: boolean
}

const translations: TranslationItem[] = [
    {
        code: "en",
        language: "English",
        message: "Welcome Back",
        region: "Global",
        flag: "🇬🇧",
        rtl: false,
    },
    {
        code: "sn",
        language: "Shona",
        message: "Mauya",
        region: "Zimbabwe",
        flag: "🇿🇼",
        rtl: false,
    },
    {
        code: "af",
        language: "Afrikaans",
        message: "Welkom Terug",
        region: "Southern Africa",
        flag: "🇿🇦",
        rtl: false,
    },
    {
        code: "hz",
        language: "Otjiherero",
        message: "Wayakurua",
        region: "Namibia",
        flag: "🇳🇦",
        rtl: false,
    },
    {
        code: "bem",
        language: "Bemba",
        message: "Mwapokelelwe",
        region: "Zambia",
        flag: "🇿🇲",
        rtl: false,
    },
    {
        code: "sw",
        language: "Swahili",
        message: "Karibu Tena",
        region: "East Africa",
        flag: "🌍",
        rtl: false,
    },
    {
        code: "rw",
        language: "Kinyarwanda",
        message: "Kaze Neza",
        region: "Rwanda",
        flag: "🇷🇼",
        rtl: false,
    },
    {
        code: "mg",
        language: "Malagasy",
        message: "Tongasoa indray",
        region: "Madagascar",
        flag: "🇲🇬",
        rtl: false,
    },
    {
        code: "am",
        language: "Amharic",
        message: "እንኳን ደህና መጣችሁ",
        region: "Ethiopia",
        flag: "🇪🇹",
        rtl: false,
    },
    {
        code: "fr",
        language: "French",
        message: "Bienvenue de nouveau",
        region: "International",
        flag: "🇫🇷",
        rtl: false,
    },
    {
        code: "pt",
        language: "Portuguese",
        message: "Bem regressado",
        region: "International",
        flag: "🇵🇹",
        rtl: false,
    },
    {
        code: "ar",
        language: "Arabic",
        message: "مرحبا بعودتك",
        region: "Middle East & North Africa",
        flag: "🇸🇦",
        rtl: true,
    },
    {
        code: "hi",
        language: "Hindi",
        message: "वापसी पर स्वागत है",
        region: "India",
        flag: "🇮🇳",
        rtl: false,
    },
    {
        code: "es",
        language: "Spanish",
        message: "Bienvenido de nuevo",
        region: "International",
        flag: "🇪🇸",
        rtl: false,
    },
    {
        code: "zh-CN",
        language: "Chinese (Simplified)",
        message: "欢迎回来",
        region: "China",
        flag: "🇨🇳",
        rtl: false,
    },
]

export function AuthSidebar() {
    return (
        <div className="relative w-full lg:w-1/2 h-dvh overflow-hidden flex items-center justify-center">
            <CarouselOrientation />
        </div>
    )
}

export function CarouselOrientation() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [activeIndex, setActiveIndex] = React.useState(0)

    // ✅ Listen to Shadcn's Embla instance
    React.useEffect(() => {
        if (!api) return

        const onSelect = () => setActiveIndex(api.selectedScrollSnap())
        api.on("select", onSelect)
        onSelect() // initialize

        return () => {
            api.off("select", onSelect)
        }
    }, [api])

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute top-0 left-0 w-full h-16 bg-linear-to-b from-gray-50/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-gray-50/90 to-transparent z-10 pointer-events-none" />

            <Carousel
                orientation="vertical"
                setApi={setApi}
                opts={{
                    loop: true,
                    align: "center",
                }}
                plugins={[
                    Autoplay({
                        delay: 3500,
                        stopOnInteraction: false,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="h-125">
                    {translations.map((item, i) => {
                        const isActive = i === activeIndex

                        return (
                            <CarouselItem key={i} className="min-h-12 flex items-center justify-center basis-auto">
                                <motion.div
                                    className="flex flex-col items-center justify-center select-none"
                                    animate={{
                                        opacity: isActive ? 1 : 0.3,
                                        scale: isActive ? 1.05 : 0.9,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {isActive ? (
                                        <SplitText
                                            text={item.message}
                                            className={cn(
                                                "font-semibold text-gray-800 dark:text-white text-center",
                                                item.language.toLowerCase().includes("amharic")
                                                    ? "text-3xl"
                                                    : "text-3xl"
                                            )}
                                        />
                                    ) : (
                                        <h1
                                            className={cn(
                                                "font-semibold text-gray-400 text-center",
                                                item.language.toLowerCase().includes("amharic")
                                                    ? "text-3xl"
                                                    : "text-3xl"
                                            )}
                                        >
                                            {item.message}
                                        </h1>
                                    )}
                                </motion.div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    )
}