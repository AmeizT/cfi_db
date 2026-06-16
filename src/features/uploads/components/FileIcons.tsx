"use client"

import { cn } from "@/lib/utils"
import React from "react"

const SketchFilter = ({ id }: { id: string }) => (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feTurbulence type="turbulence" baseFrequency="0.4" numOctaves="1" seed="5" result="roughness" />
        <feDisplacementMap in="displaced" in2="roughness" scale="0.4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
)

const sketchStroke = {
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
}

const SpreadsheetIcon = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 64 72" className={className}>
        <defs><SketchFilter id="sketch-ss" /></defs>
        <g filter="url(#sketch-ss)">
            {/* Slightly wobbly document outline — split into two strokes for sketch feel */}
            <path
                d="M8.2 6.3C8.1 4.0 9.9 2.1 12.1 2H43.8L55.8 14.1V65.8C55.9 68.1 54.1 70 51.9 70H12.1C9.8 70 8 68.1 8.2 65.8V6.3Z"
                className="fill-mist-50 stroke-mist-700/60"
                strokeWidth="1.4"
                {...sketchStroke}
            />
            {/* Second pass outline for double-stroke sketch effect */}
            <path
                d="M8.5 6C8.3 3.9 10 2.3 12.2 2.2H43.6L55.6 13.9V65.7C55.7 67.9 54 69.8 51.8 69.9H12.2C10 69.9 8.3 68 8.5 65.7V6Z"
                className="stroke-mist-500/30"
                strokeWidth="0.6"
                {...sketchStroke}
            />
            {/* Dog ear fold */}
            <path
                d="M44.1 2.1L55.9 14H46.2C45 14.1 43.9 13 44.1 12.1V2.1Z"
                className="fill-mist-200/70 stroke-mist-600/50"
                strokeWidth="1"
                {...sketchStroke}
            />
            {/* Grid outer rect — slightly uneven */}
            <rect x="15.8" y="21.9" width="28.3" height="32.2" rx="0.5"
                className="stroke-mist-600/55"
                strokeWidth="1.1"
                fill="none"
                strokeLinecap="round"
            />
            {/* Horizontal grid lines — hand-drawn with slight x variance */}
            <line x1="15.7" y1="29.8" x2="44.2" y2="30.1" className="stroke-mist-500/50" strokeWidth="1" strokeLinecap="round" />
            <line x1="15.9" y1="37.9" x2="44.1" y2="38.0" className="stroke-mist-500/50" strokeWidth="1" strokeLinecap="round" />
            <line x1="15.8" y1="46.1" x2="44.3" y2="45.9" className="stroke-mist-500/50" strokeWidth="1" strokeLinecap="round" />
            {/* Vertical grid lines */}
            <line x1="24.9" y1="21.8" x2="25.1" y2="54.1" className="stroke-mist-500/50" strokeWidth="1" strokeLinecap="round" />
            <line x1="34.8" y1="22.0" x2="35.2" y2="54.0" className="stroke-mist-500/50" strokeWidth="1" strokeLinecap="round" />
            {/* Scribbled header fill suggestion */}
            <line x1="16.5" y1="25" x2="24.2" y2="25" className="stroke-mist-400/40" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="25.5" y1="25" x2="34.2" y2="25" className="stroke-mist-400/30" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="35.5" y1="25" x2="43.5" y2="25" className="stroke-mist-400/30" strokeWidth="2.5" strokeLinecap="round" />
        </g>
    </svg>
)

const DocIcon = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 64 72" className={className}>
        <defs><SketchFilter id="sketch-doc" /></defs>
        <g filter="url(#sketch-doc)">
            <path
                d="M8.3 6.1C8.1 3.9 9.9 2.1 12.2 2H43.9L55.7 14.2V65.9C55.8 68.1 54.0 70 51.8 70H12.2C9.9 70 8.1 68.1 8.3 65.9V6.1Z"
                className="fill-mist-50 stroke-mist-700/60"
                strokeWidth="1.4"
                {...sketchStroke}
            />
            <path
                d="M8.6 6C8.4 4.0 10.1 2.2 12.3 2.1H43.7L55.5 13.8V65.7C55.6 67.9 53.9 69.9 51.7 70H12.3C10.1 70 8.3 68 8.6 65.7V6Z"
                className="stroke-mist-500/25"
                strokeWidth="0.5"
                {...sketchStroke}
            />
            <path
                d="M44.2 2.2L55.8 14.1H46.3C45.1 14.2 44.0 13.1 44.2 12V2.2Z"
                className="fill-mist-200/70 stroke-mist-600/50"
                strokeWidth="1"
                {...sketchStroke}
            />
            {/* Text lines — each slightly uneven */}
            <line x1="15.8" y1="26.1" x2="48.3" y2="25.9" className="stroke-mist-600/55" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="15.9" y1="33.0" x2="47.9" y2="33.2" className="stroke-mist-600/55" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="16.1" y1="39.9" x2="48.1" y2="40.1" className="stroke-mist-600/55" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="15.8" y1="46.8" x2="37.2" y2="47.0" className="stroke-mist-600/55" strokeWidth="1.4" strokeLinecap="round" />
            {/* Second pass for sketchiness */}
            <line x1="16.2" y1="26.4" x2="48.0" y2="26.2" className="stroke-mist-400/20" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="16.0" y1="33.3" x2="47.8" y2="33.5" className="stroke-mist-400/20" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="16.3" y1="40.2" x2="47.9" y2="40.4" className="stroke-mist-400/20" strokeWidth="0.6" strokeLinecap="round" />
        </g>
    </svg>
)

const ChartIcon = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 64 72" className={className}>
        <defs><SketchFilter id="sketch-chart" /></defs>
        <g filter="url(#sketch-chart)">
            <path
                d="M8.1 6.2C8.0 4.0 9.8 2.1 12.1 2H43.9L55.9 14.1V65.9C56.0 68.2 54.1 70 51.9 70H12.1C9.9 70 8.0 68.1 8.1 65.9V6.2Z"
                className="fill-mist-50 stroke-mist-700/60"
                strokeWidth="1.4"
                {...sketchStroke}
            />
            <path
                d="M8.5 6C8.3 3.9 10.0 2.2 12.3 2.1H43.7L55.6 13.9V65.8C55.7 68.0 54.0 69.9 51.7 70H12.3C10.0 69.9 8.3 68.0 8.5 65.8V6Z"
                className="stroke-mist-500/25"
                strokeWidth="0.5"
                {...sketchStroke}
            />
            <path
                d="M44.1 2.1L55.9 14H46.2C45.0 14.1 43.9 13.0 44.1 12V2.1Z"
                className="fill-mist-200/70 stroke-mist-600/50"
                strokeWidth="1"
                {...sketchStroke}
            />
            {/* Pie circle — slightly imperfect */}
            <circle cx="32" cy="40" r="13.8"
                className="stroke-mist-600/55"
                strokeWidth="1.3"
                fill="none"
                strokeDasharray="1 0"
            />
            {/* Pie slices */}
            <path
                d="M32.1 40.1 L32.0 26.3 A13.8 13.8 0 0 1 45.7 40.2 Z"
                className="fill-mist-500/35 stroke-mist-600/50"
                strokeWidth="1"
                strokeLinejoin="round"
            />
            <path
                d="M32.1 40.1 L45.8 40.2 A13.8 13.8 0 0 1 25.1 52.0 Z"
                className="fill-mist-400/30 stroke-mist-600/40"
                strokeWidth="1"
                strokeLinejoin="round"
            />
            {/* Hand-drawn centre dot */}
            <circle cx="32" cy="40" r="1.2" className="fill-mist-600/60" />
            {/* Radius lines — slightly overdrawn like pencil */}
            <line x1="32" y1="40" x2="32.2" y2="26" className="stroke-mist-600/40" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="32" y1="40" x2="45.9" y2="40.3" className="stroke-mist-600/40" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="32" y1="40" x2="24.9" y2="52.2" className="stroke-mist-600/40" strokeWidth="0.8" strokeLinecap="round" />
        </g>
    </svg>
)

const ExcelBadge = () => (
    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white border border-mist-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
            <div className="w-4 h-4 bg-[#1D6F42] rounded-sm flex items-center justify-center shrink-0">
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                    <path d="M2 2.5L5 6L2 9.5H4L6 7L8 9.5H10L7 6L10 2.5H8L6 5L4 2.5H2Z" fill="white" />
                </svg>
            </div>
            <span className="text-[11px] font-bold text-[#1D6F42] tracking-wide leading-none">XLSX</span>
        </div>
    </div>
)

export function FileIcons() {
    return (
        <div className="relative flex items-end justify-center select-none group/dropzone">

            {/* LEFT — Spreadsheet */}
            <div className={cn(
                "relative z-10 translate-x-6 rotate-[-14deg] scale-90 blur-[0.3px]",
                "opacity-70 transition-all duration-500 ease-out",
                "group-hover/dropzone:-translate-x-16 group-hover/dropzone:-rotate-22 group-hover/dropzone:scale-100 group-hover/dropzone:opacity-100 group-hover/dropzone:blur-0"
            )}>
                <SpreadsheetIcon className="w-24 h-28" />
            </div>

            {/* CENTER — Doc with XLSX badge */}
            <div className={cn(
                "relative z-30 -mx-2 pb-3",
                "scale-105 transition-all duration-500 ease-out origin-bottom",
                "group-hover/dropzone:-translate-y-6 group-hover/dropzone:rotate-3 group-hover/dropzone:scale-110 group-hover/dropzone:drop-shadow-xl"
            )}>
                <DocIcon className="w-24 h-28" />
                <ExcelBadge />
            </div>

            <div className={cn(
                "relative z-10 -translate-x-6 rotate-14 scale-90 opacity-70 blur-[0.3px]",
                "transition-all duration-500 ease-out",
                "group-hover/dropzone:translate-x-16 group-hover/dropzone:rotate-22 group-hover/dropzone:scale-100 group-hover/dropzone:opacity-100 group-hover/dropzone:blur-0"
            )}>
                <ChartIcon className="w-24 h-28" />
            </div>
        </div>
    )
}