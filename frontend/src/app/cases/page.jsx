"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCases, updateCase } from "@/lib/api"
import { Plus, ArrowUpDown } from "lucide-react"

const statusColors = {
    "New": { bg: "#e0f2fe", color: "#0369a1" },
    "In Follow-up": { bg: "#fef9c3", color: "#854d0e" },
    "Partially Paid": { bg: "#dcfce7", color: "#166534" },
    "Closed": { bg: "#f1f5f9", color: "#475569" },
}

function StatusBadge({ status }) {
    const style = statusColors[status] || { bg: "#f1f5f9", color: "#475569" }
    return (
        <span style={{
            background: style.bg,
            color: style.color,
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "500"
        }}>
            {status}
        </span>
    )
}

function OverdueBadge() {
    return (
        <span style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "3px 8px",
            borderRadius: "20px",
            fontSize: "0.7rem",
            fontWeight: "600",
            marginLeft: "6px"
        }}>
            Overdue
        </span>
    )
}

export default function CasesPage() {
    const router = useRouter()
    const [cases, setCases] = useState([])
    const [filter, setFilter] = useState("")
    const [sortOrder, setSortOrder] = useState("asc")
    const [updatingId, setUpdatingId] = useState(null)

    async function load() {
        const data = await getCases(filter, sortOrder)
        setCases(data)
    }

    useEffect(() => {
        load()
    }, [filter, sortOrder])

    async function handleStatusChange(caseId, newStatus) {
        setUpdatingId(caseId)
        await updateCase(caseId, { status: newStatus })
        await load()
        setUpdatingId(null)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "600", color: "var(--text-primary)" }}>Cases</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
                        All invoice recovery cases
                    </p>
                </div>
                <button className="btn-primary" onClick={() => router.push("/cases/new")}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Plus size={16} /> New Case
                </button>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <select value={filter} onChange={e => setFilter(e.target.value)}
                    style={{ width: "auto", minWidth: "160px" }}>
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="In Follow-up">In Follow-up</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Closed">Closed</option>
                </select>

                <button className="btn-ghost" onClick={() => setSortOrder(s => s === "asc" ? "desc" : "asc")}
                    style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                    <ArrowUpDown size={15} />
                    Due Date {sortOrder === "asc" ? "↑" : "↓"}
                </button>
            </div>

            {cases.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                    <p style={{ fontSize: "1rem" }}>No cases found</p>
                    <p style={{ fontSize: "0.875rem", marginTop: "6px" }}>Add your first case to get started</p>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                {["Client", "Invoice #", "Amount", "Due Date", "Status", "Quick Update"].map(h => (
                                    <th key={h} style={{
                                        padding: "0.75rem 1rem",
                                        textAlign: "left",
                                        fontSize: "0.78rem",
                                        fontWeight: "600",
                                        color: "var(--text-secondary)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em"
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map(c => {
                                const isOverdue = new Date(c.due_date) < today && c.status !== "Closed"
                                return (
                                    <tr key={c.id}
                                        onClick={() => router.push(`/cases/${c.id}`)}
                                        style={{
                                            borderBottom: "1px solid var(--border)",
                                            cursor: "pointer",
                                            transition: "background 0.15s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={{ padding: "0.85rem 1rem" }}>
                                            <p style={{ fontWeight: "500", color: "var(--text-primary)", fontSize: "0.875rem" }}>{c.client_name}</p>
                                            <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>{c.company}</p>
                                        </td>
                                        <td style={{ padding: "0.85rem 1rem", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                                            {c.invoice_number}
                                        </td>
                                        <td style={{ padding: "0.85rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "var(--text-primary)" }}>
                                            ₹{parseFloat(c.amount).toLocaleString("en-IN")}
                                        </td>
                                        <td style={{ padding: "0.85rem 1rem", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                                            {new Date(c.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            {isOverdue && <OverdueBadge />}
                                        </td>
                                        <td style={{ padding: "0.85rem 1rem" }}>
                                            <StatusBadge status={c.status} />
                                        </td>
                                        <td style={{ padding: "0.85rem 1rem" }} onClick={e => e.stopPropagation()}>
                                            <select
                                                value={c.status}
                                                disabled={updatingId === c.id}
                                                onChange={e => handleStatusChange(c.id, e.target.value)}
                                                style={{ width: "auto", fontSize: "0.8rem", padding: "4px 8px" }}
                                            >
                                                <option>New</option>
                                                <option>In Follow-up</option>
                                                <option>Partially Paid</option>
                                                <option>Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}