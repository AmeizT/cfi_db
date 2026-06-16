import { getMetaData } from "@/config/metadata"
import ReportsView from "@/features/reports/core/views/ReportsView"
import { ReportsOverview } from "@/features/reports/overview/views/ReportOverview";

const meta = getMetaData({ title: "Reports" })
export const metadata = { ...meta }

export default function Reports(){
    return (
        <ReportsOverview />
    )
}

function Cards(){
    const gradients = [
        "bg-linear-to-br from-[#fffbf0] to-white",
        "bg-linear-to-br from-[#f0f4ff] to-white",
        "bg-linear-to-br from-[#fdf0ff] to-white",
        "bg-linear-to-br from-[#f0f0ff] to-white",
    ]

    return (
        <div className="grid grid-cols-4 gap-0 border-x border-gray-200 overflow-hidden font-sans">

            {Array.from({ length: 6 }).map((item, index) => (
                <div key={index} className={`flex flex-col justify-between min-h-70 p-7 pb-8 ${gradients[index % gradients.length]} border-gray-200 border-r border-b
  ${(index + 1) % 4 === 0 ? "border-r-0" : ""} 
  ${index >= 4 ? "border-b-0" : ""} 
  hover:shadow-lg transition relative z-0 hover:z-10 cursor-pointer`}>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600">
                            <div className="w-5 h-5 bg-white rounded-sm opacity-80"></div>
                        </div>
                        <span className="text-[22px] font-medium text-gray-900 tracking-tight">
                            Projects
                        </span>
                    </div>
                </div>
            ))}

            {/* <div className="flex flex-col justify-between min-h-70 p-7 pb-8 bg-linear-to-br from-[#f0f4ff] to-white border-gray-200 border-r border-b hover:shadow-lg transition relative z-0 hover:z-10 cursor-pointer">

                <div className="flex-1"></div>

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600">
                        <div className="w-5 h-5 bg-white rounded-sm opacity-40"></div>
                    </div>
                    <span className="text-[22px] font-medium text-gray-900 tracking-tight">
                        Docs
                    </span>
                </div>
            </div> */}

            {/* <div className="flex flex-col justify-between min-h-70 p-7 pb-8 bg-linear-to-br from-[#fdf0ff] to-white border-gray-200 border-r border-b hover:shadow-lg transition relative z-0 hover:z-10 cursor-pointer">

                <div className="flex-1"></div>

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-linear-to-br from-orange-500 via-purple-500 to-blue-500">
                        <div className="w-5 h-5 bg-white rounded-full opacity-80"></div>
                    </div>
                    <span className="text-[22px] font-medium text-gray-900 tracking-tight">
                        Brain
                    </span>
                </div>
            </div>

            <div className="flex flex-col justify-between min-h-70 p-7 pb-8 bg-linear-to-br from-[#f0f0ff] to-white border-gray-200 border-b border-r-0 hover:shadow-lg transition relative z-0 hover:z-10 cursor-pointer">
                <div className="flex-1"></div>

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-600">
                        <div className="w-5 h-5 bg-white rounded-sm opacity-60"></div>
                    </div>
                    <span className="text-[22px] font-medium text-gray-900 tracking-tight">
                        Chat
                    </span>
                </div>
            </div> */}
        </div>
    )
}