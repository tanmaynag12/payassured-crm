from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import clients, cases

app = FastAPI(title="PayAssured CRM")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clients.router)
app.include_router(cases.router)

@app.get("/")
def root():
    return {"message": "PayAssured CRM API is running"}