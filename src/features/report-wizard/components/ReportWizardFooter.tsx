import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, SkipForwardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ReportWizardFooterProps = {
  backHref?: string | null;
  nextHref?: string | null;
  nextLabel?: string;
  canSkip: boolean;
  onSkip: () => void;
};

export function ReportWizardFooter({
  backHref,
  nextHref,
  nextLabel = "Save and continue",
  canSkip,
  onSkip,
}: ReportWizardFooterProps) {
  return (
    <footer className="sticky bottom-3 z-20 mx-3 mt-6 rounded-2xl border border-border-subtle bg-background/92 px-3 py-3 shadow-elevation-01 backdrop-blur supports-[backdrop-filter]:bg-background/82 sm:mx-5 sm:px-4 lg:mx-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {backHref ? (
          <Button variant="outline" asChild className="justify-center sm:justify-start">
            <Link href={backHref}>
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Previous
            </Link>
          </Button>
        ) : (
          <span />
        )}

        <div className="grid gap-2 sm:flex sm:items-center sm:gap-3">
          {canSkip ? (
            <Button type="button" variant="ghost" onClick={onSkip}>
              <SkipForwardIcon className="size-4" aria-hidden="true" />
              Skip this section
            </Button>
          ) : null}
          {nextHref ? (
            <Button asChild>
              <Link href={nextHref}>
                {nextLabel}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
