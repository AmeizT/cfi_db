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
    <footer className="sticky bottom-0 z-10 mt-5 border-t border-border bg-background/95 px-1 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {backHref ? (
          <Button variant="ghost" asChild className="justify-center sm:justify-start">
            <Link href={backHref}>
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Back
            </Link>
          </Button>
        ) : (
          <span />
        )}

        <div className="grid gap-2 sm:flex sm:items-center">
          {canSkip ? (
            <Button type="button" variant="outline" onClick={onSkip}>
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
