import React, { useMemo } from "react"

type CarouselSlide = {
    label: string;
    title: string;
    tagline: string;
    body: string;
};

export function WelcomeMarquee(){
    const duplicatedSlides = useMemo(() => {
        const carouselSlides: CarouselSlide[] = [
            {
                label: "Workspace",
                title: "Seamless integration",
                tagline: "simplify your workspace and workflow.",
                body: "Boost efficiency by unifying applications, automating processes, and keeping everything in sync.",
            },
            {
                label: "Database",
                title: "Reimagine church management",
                tagline: "effortlessly efficient.",
                body: "Streamline administrative tasks, manage finances, track attendance, and more—all within one intuitive platform.",
            },
            {
                label: "Bible Academy",
                title: "Deepen your faith",
                tagline: "learn, grow, and live Christ-like.",
                body: "Explore structured Bible courses, interactive learning, and insightful lessons to strengthen your spiritual journey.",
            },
        ]
        
        return Array(6).fill(carouselSlides).flat()
    }, [])

    return (
        <div className="w-full max-w-lg mx-auto overflow-hidden">
            <div className="relative h-96 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-neutral-800 to-transparent dark:to-transparent z-10"></div>

                <div className="flex flex-col animate-marquee">
                    {duplicatedSlides.map((slide, index) => (
                        <div key={`${slide.label}-${index}`} className="p-6">
                            <div className="p-6 rounded-lg">
                                <span className="mb-2 text-xs font-semibold bg-gradient-to-r from-[#999] to-[#999] bg-clip-text text-transparent uppercase tracking-tight">
                                    {slide.label}
                                </span>

                                <h3 className="mb-1 text-3xl text-charcoal-700 dark:text-white font-semibold tracking-tighter leading-[1.2] text-balance">
                                    {slide.title}<span className="bg-gradient-to-r from-[#4285f4] to-[#d96570] bg-clip-text text-transparent">&nbsp;-&nbsp;{slide.tagline}</span>
                                </h3>

                                <p className="text-[#999] text-sm font-medium">
                                    {slide.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom fade effect */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-neutral-800 to-transparent z-10"></div>
            </div>

            
            
        </div>
    );
};
