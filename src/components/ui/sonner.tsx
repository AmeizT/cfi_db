import { cn } from "@/lib/utils";
import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "dark" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            toastOptions={{
              classNames: {
                  toast: cn(
                      "!w-fit",
                      "!min-w-[16rem]",
                      "!max-w-[min(24rem,calc(100vw-2rem))]",
                      "!rounded-[1.25rem]",
                      "!border-white/10",
                      "!bg-neutral-950/90",
                      "!px-5",
                      "!min-h-14",
                      "!text-[0.875rem]",
                      "!font-medium",
                      "!text-white",
                      "whitespace-normal",
                      "break-words",
                      "backdrop-blur-2xl",
                      "shadow-elevation-sm",

                      // Center text when there is no action button
                      "[&:not(:has([data-button]))]:justify-center",
                      "[&:not(:has([data-button]))_[data-content]]:text-center",
                  ),
                  content: "min-w-0 w-auto",
                  title: "whitespace-normal break-words font-medium",
                  description:
                      "!text-white/65 whitespace-normal break-words",
                  actionButton:
                      "!rounded-lg !bg-white !text-neutral-950",
                  cancelButton:
                      "!rounded-lg !bg-white/10 !text-white",
              },
          }}
            style={
                {
                    "--border-radius": "16px",
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

export { Toaster }