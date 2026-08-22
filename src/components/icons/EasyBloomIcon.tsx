import { cn } from "@/lib/utils"
import Image from "next/image"

type EasyBloomIconProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt" | "width" | "height" | "fill"
> & {
  alt?: string
  size?: number
}

export function EasyBloomIcon({
  className,
  alt = "EazyCreate",
  size = 32,
  ...props
}: EasyBloomIconProps) {
  return (
    <Image
      {...props}
      src="/icons/easybloom.svg"
      alt={alt}
      width={size}
      height={size}
      className={cn(
        "block shrink-0 object-contain",
        className
      )}
    />
  )
}