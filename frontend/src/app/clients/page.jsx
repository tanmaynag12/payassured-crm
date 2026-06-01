"use client"

import { useState, useEffect } from "react"
import { getClients, createClient, deleteClient } from "@/lib/api"
import { Plus, X, Trash2 } from "lucide-react"

export default function ClientsPage() {
    const [clients, setClients] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [form, setForm] = useState({
        name: "",
        company: "",
        city: "",
        contact_person: "",
        phone: "",
        email: ""
    })

    async function load() {
        const data = await getClients()
        setClients(data)
    }

    useEffect(() => {
        load()
    }, [])

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            await createClient(form)
            setForm({ name: "", company: "", city: "", contact_person: "", phone: "", email: "" })
            setShowForm(false)
            await load()
        } catch (err) {
            alert("Something went wrong, please try again")
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this client? All their cases will be deleted too.")) return
        setDeletingId(id)
        await deleteClient(id)
        await load()
        setDeletingId(null)
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "600", color: "var(--text-primary)" }}>Clients</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
                        All registered clients
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? "Cancel" : "Add Client"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card" style={{
                    display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem"
                }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text-primary)" }}>New Client</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Company *</label>
                            <input name="company" value={form.company} onChange={handleChange} placeholder="Company name" required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>City</label>
                            <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Contact Person</label>
                            <input name="contact_person" value={form.contact_person} onChange={handleChange} placeholder="Contact person name" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Phone</label>
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Email</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                        <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Adding..." : "Add Client"}
                        </button>
                    </div>
                </form>
            )}

            {clients.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                    <p style={{ fontSize: "1rem" }}>No clients yet</p>
                    <p style={{ fontSize: "0.875rem", marginTop: "6px" }}>Add your first client to get started</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {clients.map(c => (
                        <div key={c.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "0.95rem" }}>{c.name}</p>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: "2px" }}>
                                    {c.company}{c.city ? ` · ${c.city}` : ""}
                                </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <div style={{ textAlign: "right" }}>
                                    {c.phone && <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{c.phone}</p>}
                                    {c.email && <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{c.email}</p>}
                                </div>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    disabled={deletingId === c.id}
                                    style={{
                                        background: "transparent", border: "none",
                                        color: "#dc2626", cursor: "pointer", padding: "6px",
                                        borderRadius: "6px", display: "flex"
                                    }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}