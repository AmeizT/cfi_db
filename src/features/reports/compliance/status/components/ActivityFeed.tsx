import { cn } from "@/lib/utils";


interface ActivityFeedItem {
  type: keyof typeof iconStyles;
  text: string;
  time: string;
}

interface Props {
  items: ActivityFeedItem[];
}

const iconStyles = {
  submitted: { bg: "bg-green-50",  text: "text-green-700", symbol: "✓" },
  warning:   { bg: "bg-amber-50",  text: "text-amber-700", symbol: "!" },
  missed:    { bg: "bg-red-50",    text: "text-red-700",   symbol: "✗" },
} as const;

export function ActivityFeed({ items }: Props) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Activity feed</p>
      <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
        {items.map((item, i) => {
          const { bg, text, symbol } = iconStyles[item.type];
          return (
            <div key={i} className="flex gap-3 px-5 py-4 items-start">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5", bg, text)}>
                {symbol}
              </div>
              <div>
                <p className="text-sm text-gray-800 leading-snug">{item.text}</p>
                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
