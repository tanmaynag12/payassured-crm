"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getCase, updateCase } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

const statusColors = {
    "New": { bg: "#e0f2fe", color: "#0369a1" },
    "In Follow-up": { bg: "#fef9c3", color: "#854d0e" },
    "Partially Paid": { bg: "#dcfce7", color: "#166534" },
    "Closed": { bg: "#f1f5f9", color: "#475569" },
}

export default function CaseDetailPage() {
    const router = useRouter()
    const { id } = useParams()
    const [caseData, setCaseData] = useState(null)
    const [status, setStatus] = useState("")
    const [notes, setNotes] = useState("")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        getCase(id).then(data => {
            setCaseData(data)
            setStatus(data.status)
            setNotes(data.notes || "")
        })
    }, [id])

    async function handleSave() {
        setSaving(true)
        await updateCase(id, { status, notes })
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    if (!caseData) return (
        <div style={{ color: "var(--text-secondary)", padding: "2rem" }}>Loading...</div>
    )

    const isOverdue = new Date(caseData.due_date) < new Date() && caseData.status !== "Closed"
    const statusStyle = statusColors[status] || { bg: "#f1f5f9", color: "#475569" }

    return (
        <div style={{ maxWidth: "680px" }}>
            <button onClick={() => router.back()} className="btn-ghost"
                style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem" }}>
                <ArrowLeft size={15} /> Back
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "600", color: "var(--text-primary)" }}>
                        {caseData.invoice_number}
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
                        {caseData.client_name} — {caseData.company}
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {isOverdue && (
                        <span style={{
                            background: "#fee2e2", color: "#dc2626",
                            padding: "4px 10px", borderRadius: "20px",
                            fontSize: "0.75rem", fontWeight: "600"
                        }}>Overdue</span>
                    )}
                    <span style={{
                        background: statusStyle.bg, color: statusStyle.color,
                        padding: "4px 12px", borderRadius: "20px",
                        fontSize: "0.78rem", fontWeight: "500"
                    }}>{status}</span>
                </div>
            </div>

            <div className="card" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    {[
                        { label: "Amount", value: "₹" + parseFloat(caseData.amount).toLocaleString("en-IN") },
                        { label: "Invoice Date", value: new Date(caseData.invoice_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                        { label: "Due Date", value: new Date(caseData.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                        { label: "Client", value: caseData.client_name },
                        { label: "Company", value: caseData.company },
                        { label: "Opened On", value: new Date(caseData.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "3px" }}>{label}</p>
                            <p style={{ fontSize: "0.9rem", fontWeight: "500", color: "var(--text-primary)" }}>{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                        Update Status
                    </label>
                    <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "auto", minWidth: "200px" }}>
                        <option>New</option>
                        <option>In Follow-up</option>
                        <option>Partially Paid</option>
                        <option>Closed</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                        Follow-up Notes
                    </label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                        placeholder="Add follow-up notes here..." rows={4} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem" }}>
                    {saved && <span style={{ fontSize: "0.82rem", color: "#16a34a" }}>Saved!</span>}
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "1rem", textAlign: "right" }}>
                Last updated: {new Date(caseData.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
        </div>
    )
}