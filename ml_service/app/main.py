from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import db
from app.api.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Events
    await db.connect_to_database()
    yield
    # Shutdown Events
    await db.close_database_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# Allow React Frontend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint for health check
@app.get("/")
def read_root():
    return {"status": "ML Microservice is Online", "version": settings.VERSION}

# Register all routers
app.include_router(api_router, prefix="/api/v1")
