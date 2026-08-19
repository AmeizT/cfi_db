"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { reportPeriodHref } from "../format"
import { useSubmittedReport } from "../hooks"

export function LegacySubmittedReportRedirect({ reportId }: { reportId: number }) {
  const router = useRouter()
  const query = useSubmittedReport(reportId)

  React.useEffect(() => {
    if (query.data) router.replace(reportPeriodHref(query.data.period_start))
  }, [query.data, router])

  if (query.isError) {
    return <View><View.Body className="py-6 lg:px-6"><Alert variant="destructive"><AlertTitle>Submitted report could not be opened</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert></View.Body></View>
  }
  return <View><View.Body className="py-6 lg:px-6"><Skeleton className="h-96 rounded-xl" /></View.Body></View>
}
