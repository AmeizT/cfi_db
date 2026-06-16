import { cva } from "class-variance-authority";

export const sidebarIconButton = cva(
    "size-11 flex items-center justify-center rounded-2xl transition-colors bg-inherit shadow-none hover:border-mist-200 focus:outline-none focus:border-none border-none",
    {
        variants: {
            active: {
                true: "bg-mist-50 text-icon-active",
                false: "text-sidebar-icon hover:bg-mist-100 hover:text-icon-active",
            },
        },
        defaultVariants: {
            active: false,
        },
    }
)