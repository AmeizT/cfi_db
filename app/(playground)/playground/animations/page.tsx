"use client"

import React from "react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "motion/react"
import SplitText from "@/components/ui/split-text"
import { cn } from "@/lib/utils"
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

type TranslationItem = {
    greeting: string
    languageName: string
}

const translations: TranslationItem[] = [
    { greeting: "Welcome Back", languageName: "English" },
    { greeting: "Mauya", languageName: "Shona" },
    { greeting: "Wayakurua", languageName: "Otjiherero" },
    { greeting: "Karibu Tena", languageName: "Swahili" },
    { greeting: "እንኳን ደህና መጣችሁ", languageName: "Amharic" },
    { greeting: "Bienvenue de nouveau", languageName: "French (North/West Africa)" },
    { greeting: "Bem regressado", languageName: "Portuguese" },
    { greeting: "Welkom Terug", languageName: "Afrikaans" },
    { greeting: "مرحبا بعودتك", languageName: "Arabic" },
    { greeting: "You don come back", languageName: "Nigerian Pidgin" },
    { greeting: "Mwapokelelwe", languageName: "Bemba" },
    { greeting: "Kaze Neza", languageName: "Kinyarwanda" },
    { greeting: "Добро пожаловать обратно", languageName: "Russian" },
    { greeting: "お帰りなさい", languageName: "Japanese" },
    { greeting: "Bienvenido de nuevo", languageName: "Spanish" },
    { greeting: "欢迎回来", languageName: "Chinese (Simplified)" },
]

function LocalizedWelcomeCarousel() {
    

    return (
        <div className="relative w-1/2 h-[500px] overflow-hidden flex items-center justify-center">
            {/* Fade masks */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/90 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/90 to-transparent pointer-events-none z-10" />

            {/* Carousel */}
            {/* <div ref={emblaRef} className="hidden overflow-hidden h-full w-full">
                <div className="flex flex-col h-full embla__container">
                    {translations.map((item, i) => {
                        const isActive = i === activeIndex
                        return (
                            <motion.div
                                key={i}
                                className="embla__slide flex flex-col items-center justify-center min-h-16 select-none"
                                animate={{
                                    opacity: isActive ? 1 : 0.3,
                                    scale: isActive ? 1.05 : 0.9,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            >
                                <small
                                    className={cn(
                                        "hidden text-sm font-medium mb-1 transition-opacity duration-500",
                                        isActive ? "opacity-100" : "opacity-40"
                                    )}
                                >
                                    {item.languageName}
                                </small>

                                {isActive ? (
                                    <SplitText
                                        text={item.greeting}
                                        className={cn(
                                            "font-semibold text-neutral-800 dark:text-white text-center",
                                            item.languageName.toLowerCase().includes("amharic")
                                                ? "text-3xl"
                                                : "text-3xl"
                                        )}
                                    />
                                ) : (
                                    <h1
                                        className={cn(
                                            "font-semibold text-neutral-400 text-center",
                                            item.languageName.toLowerCase().includes("amharic")
                                                ? "text-[22px]"
                                                : "text-3xl"
                                        )}
                                    >
                                        {item.greeting}
                                    </h1>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div> */}

            <CarouselOrientation />
        </div>
    )
}

export default function LoginScreen() {
    return (
        <div className="flex min-h-screen items-center bg-white">
            <LocalizedWelcomeCarousel />
            <div className="w-1/2 flex items-center justify-center">
                {/* Your login form here */}
            </div>
        </div>
    )
}

function CarouselOrientation() {
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
            {/* Optional fade masks */}
            <div className="absolute top-0 left-0 w-full h-16 bg-linear-to-b from-white/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-white/90 to-transparent z-10 pointer-events-none" />

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
                <CarouselContent className="h-[500px]">
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
                                            text={item.greeting}
                                            className={cn(
                                                "font-semibold text-neutral-800 dark:text-white text-center",
                                                item.languageName.toLowerCase().includes("amharic")
                                                    ? "text-3xl"
                                                    : "text-3xl"
                                            )}
                                        />
                                    ) : (
                                        <h1
                                            className={cn(
                                                "font-semibold text-neutral-400 text-center",
                                                item.languageName.toLowerCase().includes("amharic")
                                                    ? "text-3xl"
                                                    : "text-3xl"
                                            )}
                                        >
                                            {item.greeting}
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
