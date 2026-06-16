// import type { Deadline } from "@/lib/compliance-data";
import { cn } from "@/lib/utils";

interface Props {
  deadlines: unknown;
}

const urgencyStyles = {
  urgent: "bg-red-50 text-red-700",
  soon:   "bg-amber-50 text-amber-800",
  ok:     "bg-green-50 text-green-800",
};

export function DeadlinesPanel({ deadlines }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 h-full">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Upcoming deadlines</h3>
      <div className="divide-y divide-gray-50">
        {/* {deadlines.map((d) => (
          <div key={`${d.assembly}-${d.description}`} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{d.assembly}</p>
              <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>
            </div>
            <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg", urgencyStyles[d.urgency])}>
              {d.label}
            </span>
          </div>
        ))} */}
      </div>
      <button className="w-full mt-4 text-xs py-2 px-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
        Configure auto-reminders
      </button>
    </div>
  );
}
