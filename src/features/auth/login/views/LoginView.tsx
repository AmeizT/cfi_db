import { Separator } from "@/components/ui/separator"
import { AuthForm } from "../components/AuthForm"
import { AuthSidebar } from "../components/AuthSidebar"

export function LoginView(){
    return (
        <div className="w-full h-dvh flex flex-col lg:flex-row items-center">
            <AuthSidebar />

            <Separator orientation="vertical" className="hidden lg:block data-[orientation=vertical]:w-px data-[orientation=vertical]:h-[80%] bg-mist-200" />

            <div className="relative w-full lg:w-1/2 h-full bg-inherit">
                <div className="absolute z-0 h-full w-full bg-[radial-gradient(#d0d6d8_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                </div>

                <div className="absolute inset-0 z-10 self-center">
                    <AuthForm />
                </div>
            </div>
        </div>
    )
}