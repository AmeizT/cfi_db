import { ReactNode } from "react"

interface DrawerFieldProps {
  label: string
  children: ReactNode
}

export function DrawerField({ label, children }: DrawerFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
