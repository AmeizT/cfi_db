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

    React.useEffect(() => {
        const intervalId = setInterval(() => {

            setTimeout(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === translations.length - 1 ? 0 : prevIndex + 1
                )
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
                        className={translations[currentIndex].languageName.toLowerCase().includes("amharic") ? "text-3xl" : "text-3xl"} 
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    )
}