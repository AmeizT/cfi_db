"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ReportWizardSection } from "@/features/report-wizard/config/report-types";
import { updateReportSection } from "../api";

export function SkippedSectionNotice({ reportId, section, editable }: { reportId: string; section: ReportWizardSection; editable: boolean }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => updateReportSection(Number(reportId), section.backendId, { status: "not_started" }),
    onSuccess: async () => {
      toast.success(`${section.label} skip undone`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reports"] }),
        queryClient.invalidateQueries({ queryKey: ["reports-workflow"] }),
      ]);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not undo skip."),
  });
  return <Alert>
    <AlertTitle>Section skipped</AlertTitle>
    <AlertDescription>
      Undo the skip to continue entering data. Existing records are preserved.
      {editable ? <Button type="button" variant="outline" className="mt-3" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
        {mutation.isPending ? "Undoing skip…" : "Undo skip"}
      </Button> : null}
    </AlertDescription>
  </Alert>;
}

