import * as React from "react";
import { cn } from "@/utils/cn";

type KPIProps = React.HTMLAttributes<HTMLDivElement>

function KPIRoot({
  className,
  children,
  ...props
}: KPIProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border text-card-foreground p-4 hover:border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function KPIHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex items-start justify-between gap-3",
        className
      )}
      {...props}
    />
  );
}

function KPIContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 grid grid-cols-[1fr_auto] items-center gap-3",
        className
      )}
      {...props}
    />
  );
}

function KPIIcon({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
        className
      )}
      {...props}
    />
  );
}

function KPIActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute right-0 top-0",
        className
      )}
      {...props}
    />
  );
}

function KPITitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <dt
      className={cn(
        "text-[13px] text-muted font-medium",
        className
      )}
      {...props}
    />
  );
}

function KPIValue({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <dd
      className={cn(
        "text-3xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function KPITrend({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center",
        className
      )}
      {...props}
    />
  );
}

interface KPIProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

function KPIProgress({
  value,
  className,
  ...props
}: KPIProgressProps) {
  return (
    <div
      className={cn(
        "mt-4 h-2 overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function KPIChart({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
      {...props}
    />
  );
}

function KPISeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn(
        "-mx-4 my-4 border-border",
        className
      )}
      {...props}
    />
  );
}

function KPIFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export const KPI = Object.assign(KPIRoot, {
  Header: KPIHeader,
  Content: KPIContent,
  Icon: KPIIcon,
  Actions: KPIActions,
  Title: KPITitle,
  Value: KPIValue,
  Trend: KPITrend,
  Progress: KPIProgress,
  Chart: KPIChart,
  Separator: KPISeparator,
  Footer: KPIFooter,
});