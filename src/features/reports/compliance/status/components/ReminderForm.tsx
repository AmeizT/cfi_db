"use client";

import { useState } from "react";
import type { Assembly } from "./compliance-data";

interface Props {
  assemblies: Assembly[];
}

export function ReminderForm({ assemblies }: Props) {
  const [assembly, setAssembly] = useState("all-noncompliant");
  const [channel, setChannel] = useState("Email");
  const [message, setMessage] = useState(
    "Your report is missing required fields. Please submit by the deadline to remain compliant."
  );

  function handleSend() {
    alert(`Reminder sent via ${channel} to: ${assembly}`);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 h-full">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Send reminder</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Assembly</label>
            <select
              value={assembly}
              onChange={(e) => setAssembly(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all-noncompliant">All non-compliant</option>
              {assemblies
                .filter((a) => a.status !== "compliant")
                .map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {["Email", "SMS", "WhatsApp"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-gray-400 mb-1">Message</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button className="flex-1 text-xs py-2 px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Preview
          </button>
          <button
            onClick={handleSend}
            className="flex-1 text-xs py-2 px-3 rounded-lg bg-theme-600 text-white hover:bg-theme-700 transition-colors font-medium"
          >
            Send reminder
          </button>
        </div>
      </div>
    </div>
  );
}
