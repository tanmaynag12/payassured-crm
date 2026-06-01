"use client"

import { useState, useEffect } from "react"
import { getClients, createClient, deleteClient, updateClient } from "@/lib/api"
import { Plus, X, Trash2, Pencil, Check } from "lucide-react"

export default function ClientsPage() {
    const [clients, setClients] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [form, setForm] = useState({
        name: "", company: "", city: "",
        contact_person: "", phone: "", email: ""
    })

    async function load() {
        const data = await getClients()
        setClients(data)
    }

    useEffect(() => { load() }, [])

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleEditChange(e) {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function startEdit(client) {
        setEditingId(client.id)
        setEditForm({
            name: client.name,
            company: client.company,
            city: client.city || "",
            contact_person: client.contact_person || "",
            phone: client.phone || "",
            email: client.email || ""
        })
    }

    async function handleUpdate(id) {
        await updateClient(id, editForm)
        setEditingId(null)
        await load()
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
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>All registered clients</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? "Cancel" : "Add Client"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text-primary)" }}>New Client</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {[
                            { name: "name", label: "Name *", placeholder: "Full name", required: true },
                            { name: "company", label: "Company *", placeholder: "Company name", required: true },
                            { name: "city", label: "City", placeholder: "City" },
                            { name: "contact_person", label: "Contact Person", placeholder: "Contact person name" },
                            { name: "phone", label: "Phone", placeholder: "Phone number" },
                            { name: "email", label: "Email", placeholder: "Email address", type: "email" },
                        ].map(f => (
                            <div key={f.name}>
                                <label style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>{f.label}</label>
                                <input name={f.name} value={form[f.name]} onChange={handleChange}
                                    placeholder={f.placeholder} required={f.required} type={f.type || "text"} />
                            </div>
                        ))}
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
                        <div key={c.id} className="card">
                            {editingId === c.id ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                        {[
                                            { name: "name", placeholder: "Name" },
                                            { name: "company", placeholder: "Company" },
                                            { name: "city", placeholder: "City" },
                                            { name: "contact_person", placeholder: "Contact person" },
                                            { name: "phone", placeholder: "Phone" },
                                            { name: "email", placeholder: "Email" },
                                        ].map(f => (
                                            <input key={f.name} name={f.name} value={editForm[f.name]}
                                                onChange={handleEditChange} placeholder={f.placeholder} />
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                        <button className="btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                                        <button className="btn-primary" onClick={() => handleUpdate(c.id)}
                                            style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <Check size={15} /> Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button onClick={() => startEdit(c)} style={{
                                                background: "transparent", border: "none",
                                                color: "var(--text-secondary)", cursor: "pointer", padding: "6px",
                                                borderRadius: "6px", display: "flex"
                                            }}>
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id}
                                                style={{
                                                    background: "transparent", border: "none",
                                                    color: "#dc2626", cursor: "pointer", padding: "6px",
                                                    borderRadius: "6px", display: "flex"
                                                }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}