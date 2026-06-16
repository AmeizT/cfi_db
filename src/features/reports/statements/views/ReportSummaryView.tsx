import { Flex } from "@/components/ui/box"
import { EmptyState } from "@/components/ui/empty-state"
import TithesSummary from "../../finance/tithes/views/TithesSummaryView"
import { QuarterResponse, TithesQuarterStatement } from "../types/summary.types"

interface ReportContextProps {
    isLoading: boolean
    tab: string 
    tithesQuarterStatement: QuarterResponse<TithesQuarterStatement>
}

function ReportSummaryContent({ tab, isLoading, tithesQuarterStatement }: ReportContextProps) {
    const TAB_COMPONENTS: Record<string, React.ReactNode> = {
        tithes: <TithesSummary tithesQuarterStatement={tithesQuarterStatement}  />,
    }

    return TAB_COMPONENTS[tab] ?? "attendance data"
}


export default function ReportSummaryView({ tab, quarterStatement }: {
    tab: string, quarterStatement: QuarterResponse<TithesQuarterStatement>
 }) {
    return (
        <Flex direction="column" gap={4} justify="start" align="start" className="w-full">
            {quarterStatement ? (
                <ReportSummaryContent 
                    isLoading={false} 
                    tab={tab} 
                    tithesQuarterStatement={quarterStatement} 
                />
            ) : (
                <EmptyState
                    type={"reports"}
                    variant="both"
                    context={{ label: `${tab}` }}
                />
            )}
        </Flex>
        
    )
}