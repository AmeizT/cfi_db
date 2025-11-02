import React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import SplitText from "@/components/ui/split-text"

export function LocalizedWelcome() {
    type TranslationItem = {
        greeting: string;
        languageName: string;
    };

    const translations: TranslationItem[] = [
        { greeting: "Welcome Back", languageName: "English" },
        { greeting: "Mauya", languageName: "Shona" },
        { greeting: "Karibu Tena", languageName: "Swahili" },
        { greeting: "Welkom Terug", languageName: "Afrikaans" },
        { greeting: "Wayakurua", languageName: "Otjiherero" },
        { greeting: "Bon Retour", languageName: "French" },
        { greeting: "Bem-vindo de volta", languageName: "Portuguese" },
        { greeting: "Mwapokelelwe", languageName: "Bemba" },
        { greeting: "Kaze Neza", languageName: "Kinyarwanda" },
        // { greeting: "Siyakwamukela", languageName: "Zulu" },
        { greeting: "እንኳን ደህና መጣችሁ", languageName: "Amharic" },
    ]

    const [currentIndex, setCurrentIndex] = React.useState(0);
    // const [isEntering, setIsEntering] = React.useState(true);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            // setIsEntering(false)

            setTimeout(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === translations.length - 1 ? 0 : prevIndex + 1
                )
                // setIsEntering(true)
            }, 500)
        }, 4000)

        return () => clearInterval(intervalId)
    }, [translations.length])

    return (
        <div className="w-full flex justify-center items-center">
            <AnimatePresence mode="wait">
                <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.9, ease: "anticipate" }}
                className="min-h-20 flex flex-col justify-center gap-y-0">
                    <small className={cn("block text-body-muted text-center font-medium")}>
                        {translations[currentIndex].languageName}
                    </small>

                    <SplitText 
                        text={translations[currentIndex].greeting} 
                        className={translations[currentIndex].languageName.toLowerCase().includes("amharic") ? "text-[24px]" : "text-3xl"} 
                    />
                    
                    {/* <motion.h1
                        className={cn(
                            "text-4xl text-center leading-[1] tracking-tight font-semibold text-balance",
                            currentIndex % 2 === 0 ? "text-primary" : "text-primary"
                        )}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.05,
                                },
                            },
                        }}
                    >
                        {translations[currentIndex].greeting.split("").map((char, idx) => (
                            <motion.span
                                key={idx}
                                className="inline-block"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.h1> */}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}