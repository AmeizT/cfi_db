"use client";

import React from "react"

interface EditableNumberProps {
  value: number;
  onChange: (value: number) => void;
}

export function EditableNumber({ value, onChange }: EditableNumberProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { 
    setDraft(String(value))
  }, [value])

  React.useEffect(() => {
    if (editing) {
      ref.current?.focus()
      ref.current?.select()
    }
  }, [editing])

  const commit = () => {
    setEditing(false);
    const n = Math.max(0, parseInt(draft) || 0)
    if (n !== value) onChange(n)
  }

  if (editing) {
    return (
      <input
        ref={ref}
        type="number"
        min={0}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setDraft(String(value)); setEditing(false); }
        }}
        className="
          w-full text-center text-[13px] font-semibold tabular-nums
          bg-green-400/5 border border-green-400/40 rounded
          text-slate-100 outline-none px-0.5 py-1
          [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
        "
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="
        text-center cursor-text px-0.5 py-1 rounded tabular-nums
        text-[13px] font-semibold transition-colors duration-100
        hover:bg-green-400/7
      "
      style={{ color: value === 0 ? "#374151" : "#e2e8f0" }}
    >
      {value === 0 ? "—" : value.toLocaleString()}
    </div>
  );
}
