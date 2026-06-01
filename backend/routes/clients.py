from fastapi import APIRouter, HTTPException
from database import get_connection
from models import Client

router = APIRouter()

@router.post("/clients", status_code=201)
def create_client(client: dict):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO clients (name, company, city, contact_person, phone, email)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, name, company, city, contact_person, phone, email, created_at
    """, (
        client["name"],
        client["company"],
        client.get("city"),
        client.get("contact_person"),
        client.get("phone"),
        client.get("email")
    ))

    new_client = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "id": new_client[0],
        "name": new_client[1],
        "company": new_client[2],
        "city": new_client[3],
        "contact_person": new_client[4],
        "phone": new_client[5],
        "email": new_client[6],
        "created_at": new_client[7]
    }


@router.get("/clients")
def get_clients():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, name, company, city, contact_person, phone, email, created_at
        FROM clients
        ORDER BY created_at DESC
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    clients = []
    for row in rows:
        clients.append({
            "id": row[0],
            "name": row[1],
            "company": row[2],
            "city": row[3],
            "contact_person": row[4],
            "phone": row[5],
            "email": row[6],
            "created_at": row[7]
        })

    return clients

@router.patch("/clients/{client_id}")
def update_client(client_id: int, updates: dict):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM clients WHERE id = %s", (client_id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Client not found")

    allowed = ["name", "company", "city", "contact_person", "phone", "email"]
    fields = []
    values = []

    for key in allowed:
        if key in updates:
            fields.append(f"{key} = %s")
            values.append(updates[key])

    if not fields:
        raise HTTPException(status_code=400, detail="Nothing to update")

    values.append(client_id)

    cur.execute(f"""
        UPDATE clients SET {', '.join(fields)}
        WHERE id = %s
        RETURNING id, name, company, city, contact_person, phone, email
    """, values)

    updated = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "id": updated[0],
        "name": updated[1],
        "company": updated[2],
        "city": updated[3],
        "contact_person": updated[4],
        "phone": updated[5],
        "email": updated[6]
    }


@router.delete("/clients/{client_id}", status_code=204)
def delete_client(client_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM clients WHERE id = %s", (client_id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Client not found")

    cur.execute("DELETE FROM clients WHERE id = %s", (client_id,))
    conn.commit()
    cur.close()
    conn.close()