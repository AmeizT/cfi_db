import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, InfoIcon, HomeIcon } from "lucide-react";

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
    <footer className="mt-auto shrink-0 space-y-6 px-2 pt-6 pb-4 sm:px-4 lg:px-6 lg:pb-6">
      {canSkip ? (
        <div className="flex flex-col gap-3 rounded-3xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="text-xs leading-5"><p className="font-semibold text-foreground">Unable to complete this section now?</p><p className="text-muted-foreground">Skipped sections can be updated later while the report is editable.</p></div>
          </div>
          <Button type="button" variant="outline" className="shrink-0 border border-border-subtle bg-background" onClick={onSkip}>Skip this section</Button>
        </div>
      ) : null}
      <div aria-label="Report section navigation" className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-full bg-muted/60 p-1.5">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/" aria-label="Home"><HomeIcon className="size-4" /></Link></Button>
        {backHref ? (
          <Button variant="outline" asChild title={backLabel ? `Previous: ${backLabel}` : "Previous"} className="rounded-full border-0 bg-background px-4">
            <Link href={backHref}>
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              <span>Previous</span>
            </Link>
          </Button>
         ) : <Button variant="ghost" disabled className="rounded-full"><ArrowLeftIcon className="size-4" />Previous</Button>}

        <div className="grid gap-2 sm:flex sm:items-center sm:gap-3">
          {submitFormId ? <Button type="submit" form={submitFormId} className="rounded-full px-4">Save &amp; Continue<ArrowRightIcon className="size-4" aria-hidden="true" /></Button> : nextHref ? (
            <Button asChild className="rounded-full px-4">
              <Link href={nextHref}>
                <span title={nextStep && stepCount ? `Step ${nextStep} of ${stepCount}` : undefined}>{nextLabel.includes("Review") ? "Review" : "Next"}</span>
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
