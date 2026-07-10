"use client"

import { useState, useRef, useEffect } from "react";

const NUMERIC_FIELDS = [
    { key: "men", label: "Men", icon: "👤" },
    { key: "women", label: "Women", icon: "👤" },
    { key: "visitor_men", label: "Visitor Men", icon: "🙋" },
    { key: "visitor_women", label: "Visitor Women", icon: "🙋" },
    { key: "new_convert_men", label: "Convert Men", icon: "✨" },
    { key: "new_convert_women", label: "Convert Women", icon: "✨" },
    { key: "altar_call_men", label: "Altar Men", icon: "🙏" },
    { key: "altar_call_women", label: "Altar Women", icon: "🙏" },
    { key: "baptism_men", label: "Baptism Men", icon: "💧" },
    { key: "baptism_women", label: "Baptism Women", icon: "💧" },
    { key: "online_viewers", label: "Online", icon: "📺" },
    { key: "volunteers_on_duty", label: "Volunteers", icon: "🦺" },
    { key: "total_leaders_present", label: "Leaders", icon: "⭐" },
];

const SERVICE_TYPES = ["Sunday", "Wednesday", "Friday", "Special"];
const WEATHER_OPTIONS = ["Sunny", "Cloudy", "Rainy", "Stormy", "Windy", "Clear"];

let nextId = 5;
function makeEmpty() {
    return {
        id: nextId++, timestamp: new Date().toISOString().split("T")[0],
        service_type: "Sunday", is_special_event: false, special_event_name: "",
        weather: "", preacher: "", sermon: "", scriptures: "", notes: "",
        men: 0, women: 0, visitor_men: 0, visitor_women: 0,
        new_convert_men: 0, new_convert_women: 0, altar_call_men: 0, altar_call_women: 0,
        baptism_men: 0, baptism_women: 0, online_viewers: 0, volunteers_on_duty: 0, total_leaders_present: 0,
    };
}

const SEED = [
    { id: 1, timestamp: "2025-03-02", service_type: "Sunday", is_special_event: false, special_event_name: "", weather: "Sunny", preacher: "Pastor John", sermon: "Walking by Faith", scriptures: "Heb 11:1-6", notes: "", men: 148, women: 164, visitor_men: 10, visitor_women: 14, new_convert_men: 3, new_convert_women: 5, altar_call_men: 9, altar_call_women: 13, baptism_men: 1, baptism_women: 2, online_viewers: 145, volunteers_on_duty: 18, total_leaders_present: 34 },
    { id: 2, timestamp: "2025-02-23", service_type: "Sunday", is_special_event: false, special_event_name: "", weather: "Cloudy", preacher: "Pastor Sarah", sermon: "The Power of Praise", scriptures: "Ps 22:3", notes: "Good turnout despite weather", men: 139, women: 150, visitor_men: 13, visitor_women: 18, new_convert_men: 2, new_convert_women: 3, altar_call_men: 7, altar_call_women: 11, baptism_men: 0, baptism_women: 0, online_viewers: 201, volunteers_on_duty: 16, total_leaders_present: 28 },
    { id: 3, timestamp: "2025-02-19", service_type: "Wednesday", is_special_event: false, special_event_name: "", weather: "Rainy", preacher: "Elder Mike", sermon: "Prayer & Fasting", scriptures: "Matt 6:16-18", notes: "", men: 62, women: 72, visitor_men: 4, visitor_women: 5, new_convert_men: 1, new_convert_women: 1, altar_call_men: 3, altar_call_women: 4, baptism_men: 0, baptism_women: 0, online_viewers: 89, volunteers_on_duty: 10, total_leaders_present: 19 },
    { id: 4, timestamp: "2025-02-16", service_type: "Sunday", is_special_event: true, special_event_name: "Valentine's Sunday", weather: "Sunny", preacher: "Pastor John", sermon: "Love of God", scriptures: "John 3:16", notes: "Special couples event", men: 190, women: 211, visitor_men: 28, visitor_women: 39, new_convert_men: 6, new_convert_women: 8, altar_call_men: 16, altar_call_women: 22, baptism_men: 3, baptism_women: 4, online_viewers: 312, volunteers_on_duty: 24, total_leaders_present: 41 },
    { id: 5, timestamp: "2025-02-09", service_type: "Sunday", is_special_event: false, special_event_name: "", weather: "Clear", preacher: "Pastor John", sermon: "Renewed Strength", scriptures: "Isa 40:31", notes: "", men: 130, women: 146, visitor_men: 8, visitor_women: 11, new_convert_men: 2, new_convert_women: 2, altar_call_men: 5, altar_call_women: 7, baptism_men: 1, baptism_women: 0, online_viewers: 178, volunteers_on_duty: 15, total_leaders_present: 26 },
];

function EditableNumber({ value, onChange }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(String(value));
    const ref = useRef();
    useEffect(() => { if (editing) { ref.current?.focus(); ref.current?.select(); } }, [editing]);
    const commit = () => { setEditing(false); const n = Math.max(0, parseInt(draft) || 0); if (n !== value) onChange(n); };
    const startEditing = () => { setDraft(String(value)); setEditing(true); };
    return editing ? (
        <input ref={ref} type="number" min={0} value={draft}
            onChange={e => setDraft(e.target.value)} onBlur={commit}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(String(value)); setEditing(false); } }}
            style={{ width: "100%", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.4)", borderRadius: 4, outline: "none", color: "#f1f5f9", fontFamily: "inherit", fontSize: 13, fontVariantNumeric: "tabular-nums", fontWeight: 600, textAlign: "center", padding: "4px 2px" }}
        />
    ) : (
        <div onClick={startEditing}
            style={{ textAlign: "center", cursor: "text", padding: "5px 2px", borderRadius: 4, fontVariantNumeric: "tabular-nums", fontSize: 13, fontWeight: 600, color: value === 0 ? "#374151" : "#e2e8f0", transition: "background 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
            {value === 0 ? "—" : value.toLocaleString()}
        </div>
    );
}

const drawerInput = { width: "100%", background: "#141920", border: "1px solid #1e2a35", borderRadius: 7, padding: "9px 12px", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" };

function Field({ label, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563" }}>{label}</label>
            {children}
        </div>
    );
}

function Drawer({ row, onClose, onSave, onDelete }) {
    const [form, setForm] = useState({ ...row });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const badgeColor = form.service_type === "Sunday" ? { bg: "#0d2318", text: "#4ade80", border: "#14532d" }
        : form.service_type === "Wednesday" ? { bg: "#0f0f2e", text: "#818cf8", border: "#1e1b4b" }
            : { bg: "#1a1510", text: "#fb923c", border: "#431407" };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "stretch" }}>
            <div onClick={onClose} style={{ flex: 1, background: "rgba(2,6,10,0.75)", backdropFilter: "blur(6px)" }} />
            <div style={{ width: 460, display: "flex", flexDirection: "column", background: "#0b1017", borderLeft: "1px solid #1a2535", animation: "drawerIn 0.22s cubic-bezier(0.22,1,0.36,1)", overflowY: "auto" }}>

                {/* Drawer header */}
                <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #111a24" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: "0.06em", background: badgeColor.bg, color: badgeColor.text, border: `1px solid ${badgeColor.border}` }}>
                                    {form.is_special_event ? `✦ ${form.special_event_name || "Special"}` : form.service_type}
                                </span>
                                {form.weather && <span style={{ fontSize: 12, color: "#6b7280" }}>{form.weather}</span>}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: "#f9fafb", lineHeight: 1.2 }}>
                                {form.timestamp}
                            </div>
                            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                                {form.preacher || "No preacher set"}
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 20, padding: 4, lineHeight: 1 }}>✕</button>
                    </div>
                </div>

                {/* Form */}
                <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="Date">
                            <input type="date" value={form.timestamp} onChange={e => set("timestamp", e.target.value)} style={drawerInput} />
                        </Field>
                        <Field label="Service Type">
                            <select value={form.service_type} onChange={e => set("service_type", e.target.value)} style={drawerInput}>
                                {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </Field>
                    </div>

                    <Field label="Weather">
                        <select value={form.weather} onChange={e => set("weather", e.target.value)} style={drawerInput}>
                            <option value="">— select —</option>
                            {WEATHER_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                    </Field>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#0e1620", border: "1px solid #1e2a35", borderRadius: 7 }}>
                        <input type="checkbox" id="special" checked={form.is_special_event} onChange={e => set("is_special_event", e.target.checked)} style={{ accentColor: "#4ade80", width: 15, height: 15, cursor: "pointer" }} />
                        <label htmlFor="special" style={{ fontSize: 13, color: "#d1d5db", cursor: "pointer", userSelect: "none" }}>Mark as special event</label>
                    </div>

                    {form.is_special_event && (
                        <Field label="Event Name">
                            <input value={form.special_event_name} onChange={e => set("special_event_name", e.target.value)} placeholder="e.g. Easter Sunday" style={drawerInput} />
                        </Field>
                    )}

                    <div style={{ height: 1, background: "#111a24" }} />

                    <Field label="Preacher">
                        <input value={form.preacher} onChange={e => set("preacher", e.target.value)} placeholder="Name of preacher" style={drawerInput} />
                    </Field>
                    <Field label="Sermon Title">
                        <input value={form.sermon} onChange={e => set("sermon", e.target.value)} placeholder="Sermon title" style={drawerInput} />
                    </Field>
                    <Field label="Key Scriptures">
                        <input value={form.scriptures} onChange={e => set("scriptures", e.target.value)} placeholder="e.g. John 3:16, Ps 23" style={drawerInput} />
                    </Field>
                    <Field label="Notes">
                        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Any additional notes…" rows={3}
                            style={{ ...drawerInput, resize: "vertical", lineHeight: 1.6 }} />
                    </Field>
                </div>

                {/* Footer */}
                <div style={{ padding: "16px 28px 28px", borderTop: "1px solid #111a24", display: "flex", flexDirection: "column", gap: 10 }}>
                    <button onClick={() => { onSave(form); onClose(); }}
                        style={{ width: "100%", background: "#4ade80", color: "#030a03", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#22c55e"}
                        onMouseLeave={e => e.currentTarget.style.background = "#4ade80"}
                    >
                        Save Changes
                    </button>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={onClose} style={{ flex: 1, background: "transparent", color: "#6b7280", border: "1px solid #1e2a35", borderRadius: 8, padding: "10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                            Cancel
                        </button>
                        <button onClick={() => { onDelete(row.id); onClose(); }}
                            style={{ flex: 1, background: "transparent", color: "#f87171", border: "1px solid #2d1515", borderRadius: 8, padding: "10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            Delete Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AttendanceTableForm() {
    const [rows, setRows] = useState(SEED);
    const [drawer, setDrawer] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [hoveredRow, setHoveredRow] = useState(null);

    const updateCell = (id, key, val) => setRows(r => r.map(row => row.id === id ? { ...row, [key]: val } : row));
    const saveDrawer = (updated) => setRows(r => r.map(row => row.id === updated.id ? updated : row));
    const deleteRow = (id) => { setRows(r => r.filter(row => row.id !== id)); setSelected(s => { const n = new Set(s); n.delete(id); return n; }); };
    const addRow = () => { const r = makeEmpty(); setRows(p => [r, ...p]); setDrawer(r); };
    const toggleSelect = (id) => setSelected(s => {
        const n = new Set(s);
        if (n.has(id)) {
            n.delete(id);
        } else {
            n.add(id);
        }
        return n;
    });
    const allSelected = rows.length > 0 && selected.size === rows.length;
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map(r => r.id)));
    const deleteSelected = () => { setRows(r => r.filter(row => !selected.has(row.id))); setSelected(new Set()); };

    const totalAdultsFor = (row) => (row.men || 0) + (row.women || 0);
    const totalVisitorsFor = (row) => (row.visitor_men || 0) + (row.visitor_women || 0);
    const totalNewConvertsFor = (row) => (row.new_convert_men || 0) + (row.new_convert_women || 0);
    const totalBaptismsFor = (row) => (row.baptism_men || 0) + (row.baptism_women || 0);
    const headcountFor = (row) => totalAdultsFor(row) + totalVisitorsFor(row) + (row.online_viewers || 0);

    const totals = NUMERIC_FIELDS.reduce((acc, { key }) => ({ ...acc, [key]: rows.reduce((s, r) => s + (r[key] || 0), 0) }), {});
    const totalAdults = rows.reduce((sum, row) => sum + totalAdultsFor(row), 0);
    const totalVisitors = rows.reduce((sum, row) => sum + totalVisitorsFor(row), 0);
    const totalNewConverts = rows.reduce((sum, row) => sum + totalNewConvertsFor(row), 0);
    const totalBaptisms = rows.reduce((sum, row) => sum + totalBaptismsFor(row), 0);
    const totalHeadcount = rows.reduce((sum, row) => sum + headcountFor(row), 0);

    const serviceColor = (row) => row.is_special_event
        ? { bg: "#1a1006", text: "#fb923c", border: "#431407" }
        : row.service_type === "Sunday" ? { bg: "#091a10", text: "#4ade80", border: "#14532d" }
            : row.service_type === "Wednesday" ? { bg: "#0d0d20", text: "#818cf8", border: "#1e1b4b" }
                : { bg: "#111520", text: "#67e8f9", border: "#164e63" };

    return (
        <div style={{ minHeight: "100vh", background: "#060a0e", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&family=Lora:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060a0e; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2a35; border-radius: 10px; }
        @keyframes drawerIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        select option { background: #0b1017; }
      `}</style>

            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 32px 64px", animation: "fadeUp 0.4s ease" }}>

                {/* Page header */}
                <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80aa" }} />
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4ade80" }}>Live Records</span>
                        </div>
                        <h1 style={{ fontFamily: "'Lora', serif", fontSize: 36, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.02em", lineHeight: 1 }}>
                            Attendance
                        </h1>
                        <p style={{ color: "#4b5563", fontSize: 13, marginTop: 8, fontFamily: "'DM Mono', monospace" }}>
                            {rows.length} records · {totalHeadcount.toLocaleString()} total headcount
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {selected.size > 0 && (
                            <button onClick={deleteSelected}
                                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid #3d1515", color: "#f87171", borderRadius: 8, padding: "9px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.02em" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                            >
                                Delete {selected.size} selected
                            </button>
                        )}
                        <button onClick={addRow}
                            style={{ background: "#4ade80", color: "#030a03", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.03em", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.boxShadow = "0 0 20px rgba(74,222,128,0.3)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#4ade80"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                            + New Record
                        </button>
                    </div>
                </div>

                {/* Summary chips */}
                <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                    {[
                        { label: "Adults", value: totalAdults, color: "#4ade80" },
                        { label: "Visitors", value: totalVisitors, color: "#a78bfa" },
                        { label: "Converts", value: totalNewConverts, color: "#fb923c" },
                        { label: "Baptisms", value: totalBaptisms, color: "#38bdf8" },
                        { label: "Online", value: totals.online_viewers, color: "#e879f9" },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ padding: "6px 14px", background: "#0b1017", border: "1px solid #141f2a", borderRadius: 20, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color }}>{value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                {/* Table container */}
                <div style={{ background: "#080d12", border: "1px solid #141f2a", borderRadius: 12, overflow: "hidden" }}>

                    {/* Header row */}
                    <div style={{ display: "flex", alignItems: "center", background: "#0a1018", borderBottom: "1px solid #141f2a", position: "sticky", top: 0, zIndex: 10 }}>
                        <div style={{ width: 44, flexShrink: 0, display: "flex", justifyContent: "center", padding: "14px 0" }}>
                            <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: "#4ade80", cursor: "pointer" }} />
                        </div>
                        <div style={{ width: 118, flexShrink: 0, padding: "14px 16px 14px 8px" }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#374151" }}>Date</span>
                        </div>
                        <div style={{ width: 106, flexShrink: 0, padding: "14px 8px" }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#374151" }}>Service</span>
                        </div>
                        {NUMERIC_FIELDS.map(f => (
                            <div key={f.key} style={{ flex: 1, minWidth: 72, padding: "10px 4px", textAlign: "center" }}>
                                <div style={{ fontSize: 14, marginBottom: 2 }}>{f.icon}</div>
                                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "#374151", lineHeight: 1.3 }}>{f.label}</div>
                            </div>
                        ))}
                        <div style={{ width: 72, flexShrink: 0, padding: "14px 8px", textAlign: "center" }}>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#374151" }}>Total</div>
                        </div>
                        <div style={{ width: 48, flexShrink: 0 }} />
                    </div>

                    {/* Data rows */}
                    {rows.map((row) => {
                        const headcount = headcountFor(row);
                        const sc = serviceColor(row);
                        const isHovered = hoveredRow === row.id;
                        return (
                            <div key={row.id}
                                onMouseEnter={() => setHoveredRow(row.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #0e1620", background: selected.has(row.id) ? "rgba(74,222,128,0.04)" : isHovered ? "#09101a" : "transparent", transition: "background 0.1s", minHeight: 50 }}>

                                <div style={{ width: 44, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} style={{ accentColor: "#4ade80", cursor: "pointer" }} />
                                </div>

                                <div style={{ width: 118, flexShrink: 0, padding: "10px 16px 10px 8px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#6b7280" }}>
                                    {row.timestamp}
                                </div>

                                <div style={{ width: 106, flexShrink: 0, padding: "10px 8px" }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.05em", fontFamily: "'DM Mono', monospace", background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, whiteSpace: "nowrap" }}>
                                        {row.is_special_event ? `✦ ${row.special_event_name || "Special"}` : row.service_type.toUpperCase()}
                                    </span>
                                </div>

                                {NUMERIC_FIELDS.map(f => (
                                    <div key={f.key} style={{ flex: 1, minWidth: 72, padding: "6px 4px" }}>
                                        <EditableNumber value={row[f.key]} onChange={v => updateCell(row.id, f.key, v)} />
                                    </div>
                                ))}

                                <div style={{ width: 72, flexShrink: 0, padding: "10px 8px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: headcount > 0 ? "#4ade80" : "#374151" }}>
                                    {headcount > 0 ? headcount.toLocaleString() : "—"}
                                </div>

                                <div style={{ width: 48, flexShrink: 0, display: "flex", justifyContent: "center", opacity: isHovered ? 1 : 0, transition: "opacity 0.15s" }}>
                                    <button onClick={() => setDrawer(rows.find(r => r.id === row.id))}
                                        style={{ background: "none", border: "1px solid #1e2a35", borderRadius: 6, color: "#6b7280", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, transition: "all 0.15s" }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.background = "rgba(74,222,128,0.08)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2a35"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "none"; }}
                                    >↗</button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty state */}
                    {rows.length === 0 && (
                        <div style={{ padding: "72px 0", textAlign: "center" }}>
                            <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
                            <div style={{ color: "#374151", fontSize: 15 }}>No records yet</div>
                            <div style={{ color: "#4b5563", fontSize: 13, marginTop: 4 }}>Click <span style={{ color: "#4ade80" }}>+ New Record</span> to get started</div>
                        </div>
                    )}

                    {/* Totals footer */}
                    {rows.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", background: "#0a1018", borderTop: "1px solid #141f2a" }}>
                            <div style={{ width: 44, flexShrink: 0 }} />
                            <div style={{ width: 118, flexShrink: 0, padding: "12px 16px 12px 8px", fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563" }}>Totals</div>
                            <div style={{ width: 106, flexShrink: 0 }} />
                            {NUMERIC_FIELDS.map(f => (
                                <div key={f.key} style={{ flex: 1, minWidth: 72, padding: "12px 4px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>
                                    {totals[f.key] > 0 ? totals[f.key].toLocaleString() : "—"}
                                </div>
                            ))}
                            <div style={{ width: 72, flexShrink: 0, padding: "12px 8px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: "#4ade80" }}>
                                {totalHeadcount.toLocaleString()}
                            </div>
                            <div style={{ width: 48, flexShrink: 0 }} />
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 16, display: "flex", gap: 20, color: "#374151", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>
                    <span>↗ Hover row to open details</span>
                    <span>· Click any number to edit</span>
                    <span>· Enter to confirm</span>
                </div>
            </div>

            {drawer && (
                <Drawer
                    row={drawer}
                    onClose={() => setDrawer(null)}
                    onSave={saveDrawer}
                    onDelete={deleteRow}
                />
            )}
        </div>
    );
}
