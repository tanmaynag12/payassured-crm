const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getClients() {
  const res = await fetch(`${BASE_URL}/clients`);
  return res.json();
}

export async function createClient(data) {
  const res = await fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getCases(status = "", sortOrder = "asc") {
  let url = `${BASE_URL}/cases?sort_by=due_date&order=${sortOrder}`;
  if (status) url += `&status=${status}`;
  const res = await fetch(url);
  return res.json();
}

export async function getCase(id) {
  const res = await fetch(`${BASE_URL}/cases/${id}`);
  return res.json();
}

export async function createCase(data) {
  const res = await fetch(`${BASE_URL}/cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCase(id, data) {
  const res = await fetch(`${BASE_URL}/cases/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function deleteCase(id) {
  await fetch(`${BASE_URL}/cases/${id}`, { method: "DELETE" });
}

export async function deleteClient(id) {
  await fetch(`${BASE_URL}/clients/${id}`, { method: "DELETE" });
}
export async function updateClient(id, data) {
  const res = await fetch(`${BASE_URL}/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateCaseDetails(id, data) {
  const res = await fetch(`${BASE_URL}/cases/${id}/details`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
