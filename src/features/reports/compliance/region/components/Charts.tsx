"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler);

interface TrendChartProps {
  data: unknown
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Completion trend — all assemblies</h3>
      <div className="relative h-44">
        {/* <Line
          data={{
            labels: data.labels,
            datasets: [
              {
                label: "Avg completion %",
                data: data.avgCompletion,
                borderColor: "#378ADD",
                backgroundColor: "rgba(55,138,221,0.07)",
                tension: 0.35,
                fill: true,
                pointBackgroundColor: "#378ADD",
                pointRadius: 4,
                borderWidth: 2,
                yAxisID: "y",
              },
              {
                label: "Fully compliant",
                data: data.fullyCompliant,
                borderColor: "#639922",
                backgroundColor: "transparent",
                tension: 0.35,
                borderDash: [4, 3],
                pointBackgroundColor: "#639922",
                pointRadius: 4,
                borderWidth: 2,
                yAxisID: "y1",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y:  { min: 0, max: 100, ticks: { callback: (v) => `${v}%`, font: { size: 11 } }, grid: { color: "rgba(128,128,128,0.08)" } },
              y1: { position: "right", min: 0, max: 12, ticks: { font: { size: 11 } }, grid: { display: false } },
            },
          }}
        /> */}
      </div>
      <div className="flex gap-5 mt-3">
        {[
          { color: "#378ADD", label: "Avg completion %" },
          { color: "#639922", label: "Fully compliant assemblies", dashed: true },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span style={{ background: l.dashed ? "transparent" : l.color, borderBottom: l.dashed ? `2px dashed ${l.color}` : "none", width: 12, height: l.dashed ? 0 : 10, display: "inline-block", borderRadius: 2 }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface FieldBreakdownProps {
  fields: unknown;
}

export function FieldBreakdownChart({ fields }: FieldBreakdownProps) {
  const colors = ["#639922", "#378ADD", "#EF9F27", "#E24B4A"];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Field submission breakdown</h3>
      <div className="flex gap-4 items-center">
        {/* <div className="relative w-32 h-32 flex-shrink-0">
          <Doughnut
            data={{
              labels: fields.map((f) => f.label),
              datasets: [{ data: fields.map((f) => f.pct), backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "70%",
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}%` } } },
            }}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {fields.map((f, i) => (
            <div key={f.label} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: colors[i] }} />
              <span className="text-gray-500 flex-1">{f.label}</span>
              <span className="font-medium text-gray-800">{f.pct}%</span>
            </div>
          ))}
          <p className="text-[11px] text-gray-400 mt-1">Attendance is the most missed field.</p>
        </div> */}
      </div>
    </div>
  );
}
