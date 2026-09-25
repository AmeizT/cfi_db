import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type MonthlyReportFooterProps = {
  backLabel?: string;
  nextStep?: number;
  stepCount?: number;
  backHref?: string | null;
  nextHref?: string | null;
  nextLabel?: string;
  canSkip: boolean;
  onSkip: () => void;
  submitFormId?: string;
};

export function MonthlyReportFooter({
  backLabel,
  nextStep,
  stepCount,
  backHref,
  nextHref,
  nextLabel = "Save and continue",
  canSkip,
  onSkip,
  submitFormId,
}: MonthlyReportFooterProps) {
  return (
    <footer className="sticky bottom-0 z-10 shrink-0 space-y-3 bg-[color-mix(in_oklab,var(--muted)_20%,var(--background))] px-2 pt-3 pb-2 sm:px-4 sm:pb-4">
      {canSkip ? (
        <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="text-xs leading-5"><p className="font-semibold text-foreground">Unable to complete this section now?</p><p className="text-muted-foreground">Skipped sections can be updated later while the report is editable.</p></div>
          </div>
          <Button type="button" variant="outline" className="shrink-0 border border-border-subtle bg-background" onClick={onSkip}>Skip this section</Button>
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
        {backHref ? (
          <Button variant="outline" asChild className="h-auto min-h-12 justify-center border border-border-subtle px-4 py-2.5 sm:justify-start">
            <Link href={backHref}>
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              <span className="text-left">Previous{backLabel ? <span className="block text-xs font-normal text-muted-foreground">{backLabel}</span> : null}</span>
            </Link>
          </Button>
        ) : <span />}

        <div className="grid gap-2 sm:flex sm:items-center sm:gap-3">
          {submitFormId ? <Button type="submit" form={submitFormId} className="h-auto min-h-12 px-5 py-2.5">Save &amp; Continue<ArrowRightIcon className="size-4" aria-hidden="true" /></Button> : nextHref ? (
            <Button asChild className="h-auto min-h-12 px-5 py-2.5">
              <Link href={nextHref}>
                <span className="text-left whitespace-normal">{nextLabel}{nextStep && stepCount ? <span className="mt-0.5 block text-xs font-normal opacity-80">Step {nextStep} of {stepCount}</span> : null}</span>
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
