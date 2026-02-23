import React, { useState } from "react";

// ─── Each module defines its own card renderer and fields ───

const MODULE_CONFIGS: any = {
  aip: {
    label: "Asset Innovation Planning", short: "AIP",
    color: "#dc2626", bg: "#fef2f2", accent: "#fee2e2", // Red-600, Red-50, Red-100
    icon: "📦",
  },
  launch: {
    label: "Launch Planning", short: "LP",
    color: "#059669", bg: "#ecfdf5", accent: "#d1fae5", // Emerald-600, Emerald-50, Emerald-100
    icon: "🚀",
  },
  admin: {
    label: "Administration", short: "ADM",
    color: "#4f46e5", bg: "#eef2ff", accent: "#e0e7ff", // Indigo-600, Indigo-50, Indigo-100
    icon: "🛡️",
  },
};

const PRIORITY: any = {
  critical: { color: "#dc2626", bg: "#fee2e2", label: "Critical" },
  high:     { color: "#d97706", bg: "#fef3c7", label: "High"     },
  medium:   { color: "#4f46e5", bg: "#eef2ff", label: "Medium"   },
  low:      { color: "#64748b", bg: "#f1f5f9", label: "Low"      },
};

// ─── TASKS — each has a `type` that maps to a card renderer ───

const TASKS = [
  // ── AIP tasks ──
  {
    id: 1, module: "aip", type: "project_invite", done: false, read: false,
    priority: "high", timestamp: "10 min ago",
    data: {
      invitedBy: "Sarah Mitchell",
      project: "Compound XR-447",
      ta: "Oncology", phase: "Phase II",
      role: "Co-lead",
      message: "You're needed as backup lead for the upcoming AIP workshop.",
    },
  },
  {
    id: 2, module: "aip", type: "innovation_review", done: false, read: false,
    priority: "medium", timestamp: "2h ago",
    data: {
      project: "BioPlex Delivery",
      count: 3,
      submittedBy: "James Parker",
      innovations: [
        { title: "Extended-release formulation", category: "Formulation", status: "Under Evaluation" },
        { title: "Paediatric indication expansion", category: "Indication Expansion", status: "Idea" },
        { title: "Digital adherence companion", category: "Digital", status: "Under Evaluation" },
      ],
    },
  },
  {
    id: 3, module: "aip", type: "criteria_missing", done: false, read: true,
    priority: "low", timestamp: "1 day ago",
    data: {
      project: "Compound XR-447",
      innovations: [
        { title: "Lifecycle extension via new dosage form", missing: ["financial", "protection"] },
        { title: "Access programme for emerging markets",   missing: ["market understanding"] },
        { title: "Device integration — auto-injector",      missing: ["financial", "product characteristics"] },
      ],
    },
  },
  {
    id: 4, module: "aip", type: "document_missing", done: false, read: true,
    priority: "high", timestamp: "3h ago",
    data: {
      project: "Compound XR-447",
      missingDocs: ["LRFP", "Target Product Profile"],
      presentDocs: ["CDP", "Market Analysis"],
      workshopDate: "Mar 14, 2025",
    },
  },
  // ── Launch tasks ──
  {
    id: 5, module: "launch", type: "milestone_risk", done: false, read: false,
    priority: "critical", timestamp: "30 min ago",
    data: {
      project: "BioPlex Launch Plan",
      milestone: "Market Rollout",
      originalDate: "Jun 1, 2025",
      newDate: "Jun 24, 2025",
      slipDays: 23,
      cause: "FDA Submission moved to Apr 7",
      affected: [
        { name: "Regional Approval",       buffer: "2 weeks", risk: "manageable" },
        { name: "Launch Kit Finalization",  buffer: "none",    risk: "critical"   },
        { name: "Commercial Readiness",     buffer: "1 week",  risk: "at risk"    },
      ],
    },
  },
  {
    id: 6, module: "launch", type: "approval_override", done: false, read: true,
    priority: "high", timestamp: "Yesterday",
    data: {
      project: "BioPlex Launch Plan",
      requestedBy: "Nina Torres",
      milestone: "FDA Submission",
      from: "Mar 15, 2025",
      to: "Apr 7, 2025",
      justification: "Extended review period formally requested by regulatory affairs. Confirmed via email on Mar 1.",
    },
  },
  {
    id: 7, module: "launch", type: "scenario_shared", done: false, read: true,
    priority: "low", timestamp: "2 days ago",
    data: {
      project: "BioPlex Launch Plan",
      sharedBy: "James Parker",
      scenario: "Medical-led Q3 Launch",
      description: "Shifts commercial readiness milestones by 6 weeks to prioritise medical affairs activities.",
      keyChanges: ["FDA Submission: Mar 15 → Mar 1", "KOL Engagement added: Feb 1", "Commercial kick-off: May → Jun"],
    },
  },
  // ── Admin tasks ──
  {
    id: 8, module: "admin", type: "access_request", done: false, read: false,
    priority: "medium", timestamp: "4h ago",
    data: {
      requestedBy: "Lena Hoffmann",
      project: "Compound XR-447",
      requestedRole: "Read/Write",
      currentRole: "None",
      reason: "Joining as regional launch lead for EMEA, needs access to AIP innovation data.",
    },
  },
  {
    id: 9, module: "admin", type: "permission_changed", done: true, read: true,
    priority: "low", timestamp: "3 days ago",
    data: {
      changedBy: "Sarah Mitchell",
      project: "BioPlex Delivery",
      field: "Budget",
      from: "Read/Write",
      to: "Read Only",
      reason: "Finance review period — editing locked for all non-finance roles.",
    },
  },
];

// ─────────────────────────────────────────────────────────────
//  MODULE-SPECIFIC CARD RENDERERS
// ─────────────────────────────────────────────────────────────

function AIPCard_ProjectInvite({ data, cfg, actions }: any) {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[["Project", data.project], ["TA", data.ta], ["Phase", data.phase], ["Your Role", data.role]].map(([l, v]) => (
          <div key={l as string} style={{ background: cfg.bg, borderRadius: 8, padding: "6px 12px", flex: 1 }}>
            <div style={{ fontSize: 10, color: cfg.color, fontWeight: 700, marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{v}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 14, padding: "10px 14px", background: "#fafaf8", borderRadius: 8, borderLeft: `3px solid ${cfg.color}` }}>
        "{data.message}"
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn label="✓ Accept" primary color={cfg.color} onClick={() => actions.done()} />
        <ActionBtn label="✕ Decline" color="#dc2626" bg="#fee2e2" />
        <ActionBtn label="View Project →" color="#555" bg="#f5f4f1" />
      </div>
    </div>
  );
}

function AIPCard_InnovationReview({ data, cfg, actions }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        <strong style={{ color: cfg.color }}>{data.count} innovations</strong> submitted by <strong>{data.submittedBy}</strong> in <strong>{data.project}</strong> — awaiting your review and criteria assignment.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {data.innovations.map((inn: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", background: "#fafaf8", borderRadius: 8, border: "1px solid #f0f0f0" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 2 }}>{inn.title}</div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6, background: cfg.bg, color: cfg.color }}>{inn.category}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: inn.status === "Idea" ? "#f3f4f6" : "#fef3c7", color: inn.status === "Idea" ? "#6b7280" : "#92400e" }}>{inn.status}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn label="Review All →" primary color={cfg.color} onClick={() => actions.done()} />
        <ActionBtn label="Assign to Me" color="#555" bg="#f5f4f1" />
        <ActionBtn label="Mark Complete" color="#059669" bg="#ecfdf5" onClick={() => actions.done()} />
      </div>
    </div>
  );
}

function AIPCard_CriteriaMissing({ data, cfg, actions }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        These innovations in <strong>{data.project}</strong> will be excluded from portfolio filter results until criteria are tagged.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {data.innovations.map((inn: any, i: number) => (
          <div key={i} style={{ padding: "8px 12px", background: "#fafaf8", borderRadius: 8, border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 5 }}>{inn.title}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {inn.missing.map((m: any) => (
                <span key={m} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6, background: "#fee2e2", color: "#dc2626" }}>Missing: {m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn label="Assign Criteria →" primary color={cfg.color} onClick={() => actions.done()} />
      </div>
    </div>
  );
}

function AIPCard_DocumentMissing({ data, cfg, actions }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        Workshop for <strong>{data.project}</strong> is scheduled <strong style={{ color: "#d97706" }}>{data.workshopDate}</strong>. The following required inputs are untagged:
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>MISSING</div>
          {data.missingDocs.map((d: any) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "#fee2e2", borderRadius: 6, marginBottom: 4, fontSize: 12, fontWeight: 600, color: "#dc2626" }}>
              ✕ {d}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#1a7a4a", marginBottom: 6 }}>PRESENT</div>
          {data.presentDocs.map((d: any) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "#dcfce7", borderRadius: 6, marginBottom: 4, fontSize: 12, fontWeight: 600, color: "#166534" }}>
              ✓ {d}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn label="Upload SharePoint Link" primary color={cfg.color} onClick={() => actions.done()} />
        <ActionBtn label="View Project" color="#555" bg="#f5f4f1" />
      </div>
    </div>
  );
}

function LaunchCard_MilestoneRisk({ data, cfg, actions }: any) {
  return (
    <div>
      <div style={{ padding: "10px 14px", background: "#fee2e2", borderRadius: 10, border: "1px solid #fca5a5", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>📅 {data.milestone} slipped {data.slipDays} days</div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#7f1d1d" }}>
          <span>Was: <strong>{data.originalDate}</strong></span>
          <span>→</span>
          <span>Now: <strong>{data.newDate}</strong></span>
        </div>
        <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 4 }}>Cause: {data.cause}</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", marginBottom: 8, letterSpacing: "0.4px" }}>DOWNSTREAM IMPACT</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {data.affected.map((a: any, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", background: "#fafaf8", borderRadius: 8, border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>{a.name}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#aaa" }}>Buffer: {a.buffer}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                background: a.risk === "critical" ? "#fee2e2" : a.risk === "at risk" ? "#fef3c7" : "#dcfce7",
                color: a.risk === "critical" ? "#dc2626" : a.risk === "at risk" ? "#d97706" : "#15803d" }}>
                {a.risk}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn label="Adjust Plan →" primary color={cfg.color} onClick={() => actions.done()} />
        <ActionBtn label="Notify Team via Teams" color="#5059C9" bg="#f0eeff" />
        <ActionBtn label="View Full Impact" color="#555" bg="#f5f4f1" />
      </div>
    </div>
  );
}

function LaunchCard_ApprovalOverride({ data, cfg, actions }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        <strong>{data.requestedBy}</strong> has overridden the <strong>{data.milestone}</strong> milestone date and requires your sign-off to commit.
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, background: "#fafaf8", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#aaa", marginBottom: 2 }}>FROM</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{data.from}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", color: "#ccc", fontSize: 18 }}>→</div>
        <div style={{ flex: 1, background: "#fef3c7", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#d97706", marginBottom: 2 }}>TO</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>{data.to}</div>
        </div>
      </div>
      <div style={{ padding: "10px 14px", background: "#f5f4f1", borderRadius: 8, borderLeft: "3px solid #d97706", marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", marginBottom: 3 }}>JUSTIFICATION PROVIDED</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>"{data.justification}"</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn label="✓ Approve" primary color={cfg.color} onClick={() => actions.done()} />
        <ActionBtn label="✕ Reject" color="#dc2626" bg="#fee2e2" />
        <ActionBtn label="Request Info" color="#555" bg="#f5f4f1" />
      </div>
    </div>
  );
}

function LaunchCard_ScenarioShared({ data, cfg, actions }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        <strong>{data.sharedBy}</strong> shared scenario <strong>"{data.scenario}"</strong> for your review.
      </div>
      <div style={{ padding: "10px 14px", background: cfg.bg, borderRadius: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 8 }}>{data.description}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", marginBottom: 6 }}>KEY CHANGES</div>
        {data.keyChanges.map((c: any, i: number) => (
          <div key={i} style={{ fontSize: 12, color: cfg.color, fontWeight: 500, marginBottom: 3 }}>· {c}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn label="View Scenario →" primary color={cfg.color} onClick={() => actions.done()} />
        <ActionBtn label="Open in Teams" color="#5059C9" bg="#f0eeff" />
      </div>
    </div>
  );
}

function AdminCard_AccessRequest({ data, cfg, actions }: any) {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {data.requestedBy.split(" ").map((n: any) => n[0]).join("")}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{data.requestedBy}</div>
          <div style={{ fontSize: 12, color: "#aaa" }}>requesting access to {data.project}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "#f3f4f6", color: "#6b7280" }}>Currently: {data.currentRole}</span>
          <span style={{ color: "#ddd" }}>→</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: cfg.bg, color: cfg.color }}>Wants: {data.requestedRole}</span>
        </div>
      </div>
      <div style={{ padding: "10px 14px", background: "#fafaf8", borderRadius: 8, borderLeft: `3px solid ${cfg.color}`, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", marginBottom: 3 }}>REASON</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{data.reason}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn label="✓ Grant Access" primary color={cfg.color} onClick={() => actions.done()} />
        <ActionBtn label="✕ Deny" color="#dc2626" bg="#fee2e2" />
        <ActionBtn label="Modify Role" color="#555" bg="#f5f4f1" />
      </div>
    </div>
  );
}

function AdminCard_PermissionChanged({ data, cfg }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        <strong>{data.changedBy}</strong> updated your access on <strong>{data.project}</strong>.
      </div>
      <div style={{ background: "#fafaf8", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", marginBottom: 8 }}>FIELD AFFECTED</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: "#333" }}>{data.field}</span>
          <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: "#fef3c7", color: "#92400e", textDecoration: "line-through" }}>{data.from}</span>
          <span style={{ color: "#ccc" }}>→</span>
          <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: "#f3f4f6", color: "#6b7280" }}>{data.to}</span>
        </div>
        <div style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>{data.reason}</div>
      </div>
      <ActionBtn label="View My Permissions" color={cfg.color} bg={cfg.bg} />
    </div>
  );
}

// ─── Map type → renderer ───
const CARD_RENDERERS: any = {
  project_invite:    AIPCard_ProjectInvite,
  innovation_review: AIPCard_InnovationReview,
  criteria_missing:  AIPCard_CriteriaMissing,
  document_missing:  AIPCard_DocumentMissing,
  milestone_risk:    LaunchCard_MilestoneRisk,
  approval_override: LaunchCard_ApprovalOverride,
  scenario_shared:   LaunchCard_ScenarioShared,
  access_request:    AdminCard_AccessRequest,
  permission_changed:AdminCard_PermissionChanged,
};

const TYPE_LABELS: any = {
  project_invite:    { icon: "📨", label: "Project Invitation" },
  innovation_review: { icon: "💡", label: "Innovation Review"  },
  criteria_missing:  { icon: "⚠️", label: "Criteria Incomplete"},
  document_missing:  { icon: "📄", label: "Missing Document"   },
  milestone_risk:    { icon: "🚨", label: "Milestone At Risk"  },
  approval_override: { icon: "✅", label: "Approval Needed"    },
  scenario_shared:   { icon: "📊", label: "Scenario Shared"    },
  access_request:    { icon: "🔐", label: "Access Request"     },
  permission_changed:{ icon: "🛡️", label: "Permission Changed" },
};

// ─────────────────────────────────────────────────────────────
//  SHARED ACTION BUTTON
// ─────────────────────────────────────────────────────────────

function ActionBtn({ label, primary, color, bg, onClick }: any) {
  return (
    <button onClick={onClick}
      style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s", background: primary ? color : (bg || "#f5f4f1"), color: primary ? "#fff" : color }}
      onMouseEnter={(e: any) => e.currentTarget.style.filter = "brightness(0.93)"}
      onMouseLeave={(e: any) => e.currentTarget.style.filter = "brightness(1)"}>
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
//  TASK CARD WRAPPER
// ─────────────────────────────────────────────────────────────

function TaskCard({ task, onDone }: any) {
  const [expanded, setExpanded] = useState(false);
  const cfg = MODULE_CONFIGS[task.module];
  const pri = PRIORITY[task.priority];
  const meta = TYPE_LABELS[task.type];
  const CardBody = CARD_RENDERERS[task.type];

  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${task.done ? "#f0f0f0" : "#eee"}`, opacity: task.done ? 0.65 : 1, boxShadow: expanded ? "0 8px 32px rgba(0,0,0,0.09)" : "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s", borderLeft: `4px solid ${task.done ? "#e5e5e5" : cfg.color}` }}>

      {/* Card Header — always visible */}
      <div style={{ padding: "14px 18px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }}
        onClick={() => setExpanded(!expanded)}>

        {/* Unread dot */}
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: !task.read && !task.done ? cfg.color : "transparent", flexShrink: 0, marginTop: 6 }} />

        {/* Module + type icon */}
        <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {meta.icon}
        </div>

        {/* Title row */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            {/* Module badge */}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: cfg.bg, color: cfg.color }}>{cfg.short}</span>
            {/* Type label */}
            <span style={{ fontSize: 12, color: "#aaa" }}>{meta.label}</span>
            {/* Priority */}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: pri.bg, color: pri.color, marginLeft: "auto" }}>{pri.label}</span>
          </div>

          {/* Context summary — each type renders its own one-liner */}
          <TaskSummary task={task} cfg={cfg} />

          <div style={{ fontSize: 11, color: "#ccc", marginTop: 4 }}>{task.timestamp}</div>
        </div>

        {/* Expand chevron */}
        <div style={{ color: "#ccc", fontSize: 16, flexShrink: 0, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>⌄</div>
      </div>

      {/* Card Body — module-specific, only when expanded */}
      {expanded && (
        <div style={{ padding: "0 18px 18px 68px", borderTop: "1px solid #f8f8f6" }}>
          <div style={{ paddingTop: 14 }}>
            {CardBody ? <CardBody data={task.data} cfg={cfg} actions={{ done: () => onDone(task.id) }} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}

// One-liner summary per task type (shows in collapsed header)
function TaskSummary({ task, cfg }: any) {
  const d = task.data;
  const summaries: any = {
    project_invite:    () => <><strong>{d.invitedBy}</strong> invited you to <strong style={{ color: cfg.color }}>{d.project}</strong> as {d.role}</>,
    innovation_review: () => <><strong style={{ color: cfg.color }}>{d.count} innovations</strong> in {d.project} need your review — submitted by {d.submittedBy}</>,
    criteria_missing:  () => <><strong style={{ color: cfg.color }}>{d.innovations.length} innovations</strong> in {d.project} missing criteria tags</>,
    document_missing:  () => <><strong style={{ color: "#dc2626" }}>{d.missingDocs.join(", ")}</strong> missing from {d.project} — workshop {d.workshopDate}</>,
    milestone_risk:    () => <><strong style={{ color: "#dc2626" }}>{d.milestone}</strong> slipped {d.slipDays} days — {d.affected.length} downstream milestones affected</>,
    approval_override: () => <><strong>{d.requestedBy}</strong> overrode <strong>{d.milestone}</strong>: {d.from} → <strong style={{ color: "#d97706" }}>{d.to}</strong></>,
    scenario_shared:   () => <><strong>{d.sharedBy}</strong> shared "{d.scenario}" on {d.project}</>,
    access_request:    () => <><strong>{d.requestedBy}</strong> requested <strong style={{ color: cfg.color }}>{d.requestedRole}</strong> access to {d.project}</>,
    permission_changed:() => <><strong>{d.changedBy}</strong> changed your <strong>{d.field}</strong> access on {d.project}: {d.from} → {d.to}</>,
  };
  const fn = summaries[task.type];
  return <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{fn ? fn() : null}</div>;
}

// ─────────────────────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────────────────────

export default function MyTasks() {
  const [tasks, setTasks]       = useState(TASKS);
  const [moduleFilter, setModule] = useState("all");
  const [statusFilter, setStatus] = useState("pending");

  const markDone = (id: any) => setTasks(p => p.map(t => t.id === id ? { ...t, done: true, read: true } : t));

  const visible = tasks.filter(t => {
    const modMatch = moduleFilter === "all" || t.module === moduleFilter;
    const statusMatch = statusFilter === "pending" ? !t.done : statusFilter === "done" ? t.done : true;
    return modMatch && statusMatch;
  });

  const pendingByModule = (mod: any) => tasks.filter(t => !t.done && (mod === "all" || t.module === mod)).length;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8fafc", color: "#0f172a", borderRadius: "1.5rem", marginTop: "2rem", border: "1px solid #e2e8f0" }}>
      <style>{`
        .fade { animation: fadeIn 0.25s ease both; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }
        .filter-btn { cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; }
        .filter-btn:hover { background: #f1f5f9 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 28px", height: 56, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>My Tasks</span>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>·</span>
        <span style={{ fontSize: 13, color: "#64748b" }}>Each task card adapts to its module</span>
        {pendingByModule("all") > 0 && (
          <span style={{ background: "#dc2626", color: "#fff", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700, marginLeft: 4 }}>{pendingByModule("all")} pending</span>
        )}
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px" }}>

        {/* Filter Bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          {/* Module filter */}
          <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: 12, padding: 4, border: "1px solid #e2e8f0" }}>
            {[["all", "All Modules", "#0f172a"], ...Object.entries(MODULE_CONFIGS).map(([id, c]: any) => [id, c.short, c.color])].map(([val, label, color]: any) => (
              <button key={val} className="filter-btn" onClick={() => setModule(val)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: moduleFilter === val ? (val === "all" ? "#0f172a" : MODULE_CONFIGS[val]?.bg || "#f1f5f9") : "transparent", color: moduleFilter === val ? (val === "all" ? "#fff" : color) : "#64748b", position: "relative" }}>
                {label}
                {pendingByModule(val) > 0 && (
                  <span style={{ marginLeft: 5, background: moduleFilter === val && val !== "all" ? color : "#dc2626", color: "#fff", borderRadius: 10, padding: "0px 5px", fontSize: 10, fontWeight: 700 }}>{pendingByModule(val)}</span>
                )}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: 12, padding: 4, border: "1px solid #e2e8f0", marginLeft: "auto" }}>
            {[["pending", "Pending"], ["done", "Done"], ["all", "All"]].map(([val, label]) => (
              <button key={val} className="filter-btn" onClick={() => setStatus(val)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: statusFilter === val ? "#0f172a" : "transparent", color: statusFilter === val ? "#fff" : "#64748b" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="fade">
          {visible.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>You're all caught up</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>No tasks in this view</div>
            </div>
          ) : (
            visible.map(task => <TaskCard key={task.id} task={task} onDone={markDone} />)
          )}
        </div>
      </div>
    </div>
  );
}
