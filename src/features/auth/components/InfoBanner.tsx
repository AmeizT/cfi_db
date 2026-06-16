import React from "react"
import Link from "next/link"
import { MoveUpRight, X } from "lucide-react"

export function InfoBanner() {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
        const dismissed = localStorage.getItem("bannerDismissed")
        if (!dismissed) {
            setIsVisible(true);
        }
    }, [])

    const handleClose = () => {
        localStorage.setItem("bannerDismissed", "true")
        setIsVisible(false);
    };

    if (!isVisible) return null

    return (
        <header className="p-3 lg:px-10 h-fit lg:h-12 w-full z-50 fixed inset-0 bg-linear-to-r from-primary to-blue-700 backdrop-blur-3xl shadow">
            <div className="w-full h-full relative flex justify-center items-center gap-x-4">
                <p className="lg:inline-flex text-white text-xs font-semibold">Starting March 17, 2025, personal email logins will no longer be supported. Use a valid CFI Workspace ID to sign in.&nbsp;<Link 
                href="/blog/everything-in-one-place-introducing-cfi-workspace" className="inline-flex items-center text-white underline underline-offset-2">Learn more&nbsp;<span className="flex items-center"><MoveUpRight strokeWidth={3} className="size-2" /></span></Link></p>

                <div className="absolute inset-y-0 right-6">
                    <button onClick={handleClose} className="p-1 bg-white rounded-full text-theme-700 hover:scale-[1.05] transition-all duration-200">
                        <X strokeWidth={2.5} className="size-3" />
                    </button>
                </div>
            </div>
        </header>
    );
}