// import { CircleCheck } from "lucide-react"
import { BookOpenCheck, KeyRound, LayoutDashboard, type LucideIcon } from "lucide-react"

type FeatureItem = {
    title: string
    description: string
    icon: LucideIcon
}

const features: FeatureItem[] = [
    {
        title: "One account for all your CFI Workspace apps",
        description: "Access everything you need with a single sign-in — from church management to Bible learning tools.",
        icon: KeyRound
    },
    {
        title: "Effortless church operations, all in one place",
        description: "Streamline admin tasks, manage finances, track attendance, and automate your workflows — all while keeping everything in sync.",
        icon: LayoutDashboard
    },
    {
        title: "Strengthen your faith through guided learning",
        description: "Explore structured Bible courses, interactive lessons, and spiritual growth resources tailored for every believer.",
        icon: BookOpenCheck
    },
];



// const features: FeatureItem[] = [
//     {
//         label: "Workspace",
//         title: "One account for all your CFI Workspace apps.",
//         tagline: "simplify your workspace and workflow.",
//         description: "Boost efficiency by unifying applications, automating processes, and keeping everything in sync.",
//     },
//     {
//         label: "Database",
//         title: "Reimagine church management - effortlessly efficient.",
//         tagline: "",
//         description: "Streamline administrative tasks, manage finances, track attendance, and more.",
//     },
//     {
//         label: "Bible Academy",
//         title: "Deepen your faith - learn, grow, and live Christ-like.",
//         tagline: "",
//         description: "Explore structured Bible courses, interactive learning, and insightful lessons to strengthen your spiritual journey.",
//     },
// ]

export function Hero(){
    return (
        <section className="w-1/2 hidden lg:flex justify-center items-center">
            <div className="px-0 relative w-full h-full hidden lg:flex flex-col justify-center gap-6">
                <div className="flex flex-col gap-y-10">
                    <h1 className="text-3xl font-semibold text-center">
                        CFI Workspace
                    </h1>

                    <div className="flex flex-col gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col gap-y-2">
                                <div className="flex items-center gap-x-3">
                                    <feature.icon strokeWidth={1.5} className="size-5 text-primary" />
                                    <h5 className="text-base font-semibold">
                                        {feature.title}
                                    </h5>
                                </div>

                                <p className="pl-8 text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}


