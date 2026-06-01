from fastapi import APIRouter, HTTPException
from database import get_connection

router = APIRouter()

@router.post("/cases", status_code=201)
def create_case(case: dict):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM clients WHERE id = %s", (case["client_id"],))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Client not found")

    cur.execute("""
        INSERT INTO cases (client_id, invoice_number, amount, invoice_date, due_date, status, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id, client_id, invoice_number, amount, invoice_date, due_date, status, notes, created_at
    """, (
        case["client_id"],
        case["invoice_number"],
        case["amount"],
        case["invoice_date"],
        case["due_date"],
        case.get("status", "New"),
        case.get("notes")
    ))

    new_case = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "id": new_case[0],
        "client_id": new_case[1],
        "invoice_number": new_case[2],
        "amount": str(new_case[3]),
        "invoice_date": str(new_case[4]),
        "due_date": str(new_case[5]),
        "status": new_case[6],
        "notes": new_case[7],
        "created_at": str(new_case[8])
    }


@router.get("/cases")
def get_cases(status: str = None, sort_by: str = "due_date", order: str = "asc"):
    conn = get_connection()
    cur = conn.cursor()

    query = """
        SELECT c.id, cl.name, cl.company, c.invoice_number, c.amount,
               c.invoice_date, c.due_date, c.status, c.notes, c.created_at, c.client_id
        FROM cases c
        JOIN clients cl ON c.client_id = cl.id
    """
    params = []

    if status:
        query += " WHERE c.status = %s"
        params.append(status)

    sort_column = "c.due_date" if sort_by == "due_date" else "c.created_at"
    sort_order = "ASC" if order == "asc" else "DESC"
    query += f" ORDER BY {sort_column} {sort_order}"

    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    cases = []
    for row in rows:
        cases.append({
            "id": row[0],
            "client_name": row[1],
            "company": row[2],
            "invoice_number": row[3],
            "amount": str(row[4]),
            "invoice_date": str(row[5]),
            "due_date": str(row[6]),
            "status": row[7],
            "notes": row[8],
            "created_at": str(row[9]),
            "client_id": row[10]
        })

    return cases


@router.get("/cases/{case_id}")
def get_case(case_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT c.id, cl.name, cl.company, c.invoice_number, c.amount,
               c.invoice_date, c.due_date, c.status, c.notes, c.created_at, c.updated_at, c.client_id
        FROM cases c
        JOIN clients cl ON c.client_id = cl.id
        WHERE c.id = %s
    """, (case_id,))

    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Case not found")

    return {
        "id": row[0],
        "client_name": row[1],
        "company": row[2],
        "invoice_number": row[3],
        "amount": str(row[4]),
        "invoice_date": str(row[5]),
        "due_date": str(row[6]),
        "status": row[7],
        "notes": row[8],
        "created_at": str(row[9]),
        "updated_at": str(row[10]),
        "client_id": row[11]
    }


@router.patch("/cases/{case_id}")
def update_case(case_id: int, updates: dict):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM cases WHERE id = %s", (case_id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Case not found")

    allowed = ["status", "notes"]
    fields = []
    values = []

    for key in allowed:
        if key in updates:
            fields.append(f"{key} = %s")
            values.append(updates[key])

    if not fields:
        raise HTTPException(status_code=400, detail="Nothing to update")

    fields.append("updated_at = NOW()")
    values.append(case_id)

    cur.execute(f"""
        UPDATE cases SET {', '.join(fields)}
        WHERE id = %s
        RETURNING id, status, notes, updated_at
    """, values)

    updated = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "id": updated[0],
        "status": updated[1],
        "notes": updated[2],
        "updated_at": str(updated[3])
    }
@router.delete("/cases/{case_id}", status_code=204)
def delete_case(case_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM cases WHERE id = %s", (case_id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Case not found")

    cur.execute("DELETE FROM cases WHERE id = %s", (case_id,))
    conn.commit()
    cur.close()
    conn.close()

@router.patch("/cases/{case_id}/details")
def update_case_details(case_id: int, updates: dict):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM cases WHERE id = %s", (case_id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Case not found")

    allowed = ["invoice_number", "amount", "invoice_date", "due_date"]
    fields = []
    values = []

    for key in allowed:
        if key in updates:
            fields.append(f"{key} = %s")
            values.append(updates[key])

    if not fields:
        raise HTTPException(status_code=400, detail="Nothing to update")

    fields.append("updated_at = NOW()")
    values.append(case_id)

    cur.execute(f"""
        UPDATE cases SET {', '.join(fields)}
        WHERE id = %s
        RETURNING id, invoice_number, amount, invoice_date, due_date
    """, values)

    updated = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "id": updated[0],
        "invoice_number": updated[1],
        "amount": str(updated[2]),
        "invoice_date": str(updated[3]),
        "due_date": str(updated[4])
    }