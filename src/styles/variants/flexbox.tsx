import { cva } from "class-variance-authority"

export const flexBox = cva(
    "flex data-[align=center]:justify-center data-[align=between]:justify-between data-[orientation=vertical]:flex-col"
)