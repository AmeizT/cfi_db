import React from "react"

import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"

export function AuthCarousel(){
    const [carouselAPI, setCarouselAPI] = React.useState<CarouselApi | null>(null)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    const onSelect = React.useCallback(() => {
        if (!carouselAPI) return

        setSelectedIndex(carouselAPI.selectedScrollSnap())
    }, [carouselAPI])

    const scrollTo = (index: number) => {
        if (!carouselAPI) return

        carouselAPI.scrollTo(index)
    };

    React.useEffect(() => {
        if (!carouselAPI) return
        onSelect()
        setScrollSnaps(carouselAPI.scrollSnapList())

        carouselAPI.on("select", onSelect)
    }, [carouselAPI, onSelect])

    const activeSection = carouselSlides.find((_, index) => index === selectedIndex)

    return (
        <div className="h-4/5 w-full flex flex-col items-center justify-between">
            <Badge className="px-3 text-sm bg-sky-400 rounded-full">
                {activeSection?.section}
            </Badge>

            <div className="justify-self-center w-4/5 h-1/2">

            </div>
            
            <div className="w-full flex flex-col items-center">
                <Carousel
                    opts={{ align: "start", loop: true }}
                    plugins={[Autoplay({ delay: 3000 })]}
                    setApi={setCarouselAPI}>
                    <CarouselContent>
                        {carouselSlides?.map((slide, index) => (
                            <CarouselItem key={index} className="transition-opacity duration-500 ease-in-out">
                                <div className="w-3/4 h-full relative flex flex-col justify-center justify-self-center items-center gap-y-1.5">
                                    <h1 className="mt-2 w-4/5 text-balance text-center text-4xl text-charcoal-900 dark:text-white font-semibold tracking-tighter">
                                        {slide.title}<span className="text-sky-500">&nbsp;-&nbsp;{slide.tagline}</span>
                                    </h1>

                                    <p className="mt-3 w-3/4 text-balance text-center text-[#999] dark:text-frost-500 text-base font-medium leading-snug">
                                        {slide.body}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                <div className="w-4/5 flex justify-center gap-x-2 mt-8">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-5 h-[3px] rounded-full ${selectedIndex === index ? "bg-[#999] dark:bg-white" : "bg-gray-200 dark:bg-frost-500"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

interface CarouselSlide {
    title: string
    tagline?: string
    body: string
    section: string
}

const carouselSlides: CarouselSlide[] = [
    {
        section: "Workspace",
        title: "Seamlessly integrate your workspace",
        tagline: "simplify your workflow.",
        body: "Boost efficiency by unifying applications, automating processes, and keeping everything in sync.",
    },
    {
        section: "Database",
        title: "Reimagining church management",
        tagline: "effortlessly efficient.",
        body: "Streamline administrative tasks, manage finances, track attendance, and more—all within one intuitive platform.",
    },
    {
        section: "Bible Academy",
        title: "Deepen your faith",
        tagline: "learn, grow, and live Christ-like.",
        body: "Explore structured bible courses, interactive learning, and insightful lessons to strengthen your spiritual journey.",
    },
]