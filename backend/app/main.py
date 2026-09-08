"""
Plan2Progress — FastAPI Application Entrypoint.

AI-assisted Planning-to-Execution Bridge for infrastructure projects.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.api.router import api_router
from app.db.database import engine, Base

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context — startup and shutdown tasks."""
    # Create tables automatically in development / initial rollout if needed
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown tasks
    await engine.dispose()


app = FastAPI(
    title=settings.app_name,
    description="AI-assisted Planning-to-Execution Bridge for Infrastructure Projects (SIH 2026)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS configuration matching frontend development and staging environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check probe for container orchestrators and monitoring."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "environment": settings.environment,
        "version": "1.0.0",
    }


@app.get("/", tags=["Root"])
async def root():
    """Root redirect / welcoming endpoint."""
    return {
        "message": "Welcome to Plan2Progress API",
        "docs": "/docs",
        "health": "/health",
    }
