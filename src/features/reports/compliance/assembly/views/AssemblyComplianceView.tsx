import { useUser } from "@/hooks/query/use-user"
import { AssemblyComplianceReport } from "@/dal/types"
import { useComplianceReport } from "../../hooks/use-compliance-report"
import { ComplianceTable } from "../components/ComplianceTable"


export default function AssemblyComplianceView() {
    const { data: user } = useUser()
    const { data: complianceData } = useComplianceReport(String(user?.church))

    return (
        <ComplianceTable data={complianceData as AssemblyComplianceReport} />
    )
}
