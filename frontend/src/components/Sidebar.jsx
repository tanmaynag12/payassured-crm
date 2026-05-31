"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/cases", label: "Cases", icon: FileText },
    { href: "/clients", label: "Clients", icon: Users },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()

    return (
        <aside style={{
            width: "220px",
            minHeight: "100vh",
            background: "var(--sidebar-bg)",
            display: "flex",
            flexDirection: "column",
            padding: "1.5rem 1rem",
            position: "fixed",
            top: 0,
            left: 0,
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
                paddingLeft: "0.5rem"
            }}>
                <div>
                    <h1 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "600" }}>PayAssured</h1>
                </div>
                <button onClick={toggleTheme} style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--sidebar-text)",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>

            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                {links.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href
                    return (
                        <Link key={href} href={href} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                            padding: "0.6rem 0.75rem",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: active ? "600" : "400",
                            color: active ? "#fff" : "var(--sidebar-text)",
                            background: active ? "var(--sidebar-active)" : "transparent",
                            transition: "all 0.15s"
                        }}>
                            <Icon size={17} />
                            {label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}