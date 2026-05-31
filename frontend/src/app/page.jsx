"use client";

import { useEffect, useState } from "react";
import { getCases, getClients } from "@/lib/api";
import { Users, FileText, IndianRupee, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCases: 0,
    totalPending: 0,
    overdue: 0,
  });

  useEffect(() => {
    async function load() {
      const [clients, cases] = await Promise.all([getClients(), getCases()]);

      const today = new Date();
      const overdue = cases.filter(
        (c) => new Date(c.due_date) < today && c.status !== "Closed",
      ).length;

      const totalPending = cases
        .filter((c) => c.status !== "Closed")
        .reduce((sum, c) => sum + parseFloat(c.amount), 0);

      setStats({
        totalClients: clients.length,
        totalCases: cases.length,
        totalPending,
        overdue,
      });
    }
    load();
  }, []);

  const cards = [
    {
      label: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      color: "#4f46e5",
    },
    {
      label: "Total Cases",
      value: stats.totalCases,
      icon: FileText,
      color: "#0891b2",
    },
    {
      label: "Amount Pending",
      value: "₹" + stats.totalPending.toLocaleString("en-IN"),
      icon: IndianRupee,
      color: "#059669",
    },
    {
      label: "Overdue Cases",
      value: stats.overdue,
      icon: AlertCircle,
      color: "#dc2626",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "600",
            color: "var(--text-primary)",
          }}
        >
          Dashboard
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            marginTop: "4px",
          }}
        >
          Overview of all clients and recovery cases
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="card"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <div
              style={{
                background: color + "18",
                borderRadius: "10px",
                padding: "0.75rem",
                display: "flex",
              }}
            >
              <Icon size={22} color={color} />
            </div>
            <div>
              <p
                style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
