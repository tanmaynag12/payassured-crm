"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getClients, createCase } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

export default function NewCasePage() {
    const router = useRouter()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        client_id: "",
        invoice_number: "",
        amount: "",
        invoice_date: "",
        due_date: "",
        status: "New",
        notes: ""
    })

    useEffect(() => {
        getClients().then(setClients)
    }, [])

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            await createCase({
                ...form,
                client_id: parseInt(form.client_id),
                amount: parseFloat(form.amount)
            })
            router.push("/cases")
        } catch (err) {
            alert("Something went wrong, please try again")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: "620px" }}>
            <button onClick={() => router.back()} className="btn-ghost"
                style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem" }}>
                <ArrowLeft size={15} /> Back
            </button>

            <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "600", color: "var(--text-primary)" }}>New Case</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
                    Create a new invoice recovery case
                </p>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                        Client *
                    </label>
                    <select name="client_id" value={form.client_id} onChange={handleChange} required>
                        <option value="">Select a client</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                        Invoice Number *
                    </label>
                    <input name="invoice_number" value={form.invoice_number} onChange={handleChange}
                        placeholder="e.g. INV-2024-001" required />
                </div>

                <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                        Amount (₹) *
                    </label>
                    <input name="amount" type="number" value={form.amount} onChange={handleChange}
                        placeholder="e.g. 50000" required />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                        <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                            Invoice Date *
                        </label>
                        <input name="invoice_date" type="date" value={form.invoice_date} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                            Due Date *
                        </label>
                        <input name="due_date" type="date" value={form.due_date} onChange={handleChange} required />
                    </div>
                </div>

                <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                        Status
                    </label>
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option>New</option>
                        <option>In Follow-up</option>
                        <option>Partially Paid</option>
                        <option>Closed</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                        Notes
                    </label>
                    <textarea name="notes" value={form.notes} onChange={handleChange}
                        placeholder="Any follow-up notes..." rows={3} />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                    <button type="button" className="btn-ghost" onClick={() => router.back()}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Creating..." : "Create Case"}
                    </button>
                </div>
            </form>
        </div>
    )
}