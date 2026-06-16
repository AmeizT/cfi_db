// components/Sparkline.tsx
import React from "react";

interface SparklineProps {
    values: number[];
}

/**
 * Tiny inline SVG sparkline.
 * Color comes from the project's CSS `--color-primary` variable via `stroke-primary`.
 */
export function Sparkline({ values }: SparklineProps) {
    if (values.length < 2) return null;

    const W = 100;
    const H = 28;
    const max = Math.max(...values, 1);
    const step = W / (values.length - 1);

    const pts = values
        .map((v, i) => `${i * step},${H - (v / max) * H}`)
        .join(" ");

    const area = `${pts} ${(values.length - 1) * step},${H} 0,${H}`;

    return (
        <svg
            viewBox={`0 0 100 ${H}`}
            preserveAspectRatio="none"
            className="w-16 h-5"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={area} fill="url(#spark-grad)" />
            <polyline
                points={pts}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}
